# 3DGS Reconstruction Pipeline

Input: a phone video (`input/IMG_4588.MOV`, ~29 MB, iPhone capture of a street).
Output: a 3D Gaussian Splat scene (`exports/<name>/splat.ply`) that drops into `website/public/splats/` and renders in `SplatViewer`.

Target hardware: **Windows + NVIDIA RTX 5070 Ti** (Blackwell, 16 GB VRAM, CUDA). The Blackwell architecture (sm_120) needs CUDA 12.8+ and PyTorch 2.6+ — both are stable as of 2026 Q1.

Stack (April 2026 SOTA for captured scenes):

- **[Nerfstudio](https://docs.nerf.studio/)** — the orchestration layer (`ns-process-data`, `ns-train`, `ns-export`).
- **splatfacto / splatfacto-big** — Nerfstudio's 3DGS trainers, built on `gsplat`.
- **COLMAP (CUDA build)** — structure-from-motion to recover camera poses from the video frames. Nerfstudio wraps it.
- **ffmpeg** — frame extraction. Nerfstudio wraps it.

Output format is a standard 3DGS `.ply` that the website's `@mkkellogg/gaussian-splats-3d` viewer renders directly. Same format is compatible with Khronos `KHR_gaussian_splatting`, SuperSplat, PostShot, and SparkJS.

---

## One-time setup (Windows, PowerShell)

### 1. Prerequisites

Install these first, in any terminal:

- **[Miniconda](https://www.anaconda.com/download)** (Windows x86_64 installer). Accept "Add to PATH" during install so `conda` works in any new PowerShell.
- **[CUDA Toolkit 12.8+](https://developer.nvidia.com/cuda-downloads)** — required for Blackwell (5070 Ti). Reboot after install.
- **[COLMAP 3.10+ Windows binary with CUDA](https://github.com/colmap/colmap/releases)** — download the `*-cuda*.zip`, extract to `C:\colmap`, and add `C:\colmap` to your PATH (System Properties → Environment Variables).
- **[ffmpeg](https://www.gyan.dev/ffmpeg/builds/)** — grab the "release full" build, extract to `C:\ffmpeg`, add `C:\ffmpeg\bin` to PATH.
- **[Git for Windows](https://git-scm.com/download/win)** — already have this if you cloned the repo.

Verify in a fresh PowerShell:

```powershell
nvcc --version     # should show CUDA 12.8+
colmap -h          # should print help
ffmpeg -version    # should print version
conda --version
```

### 2. Conda environment

```powershell
conda create -n nerfstudio python=3.10 -y
conda activate nerfstudio

# PyTorch 2.6 with CUDA 12.8 (Blackwell-ready)
pip install --upgrade pip
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu128

# Nerfstudio core + splatfacto dependencies
pip install ninja
pip install git+https://github.com/NVlabs/tiny-cuda-nn.git#subdirectory=bindings/torch
pip install nerfstudio
```

Smoke test:

```powershell
python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))"
# expected: True NVIDIA GeForce RTX 5070 Ti
ns-train --help
```

---

## Run the pipeline

From the repo root, in the activated `nerfstudio` env:

```powershell
cd pipeline
```

### Step 1 — Process video → frames + COLMAP poses

`ns-process-data video` handles ffmpeg extraction *and* COLMAP SfM in one command.

```powershell
ns-process-data video `
  --data input\IMG_4588.MOV `
  --output-dir data\street `
  --num-frames-target 300 `
  --matching-method sequential
```

- `--num-frames-target 300`: 300 frames is a good sweet spot for a short street walk — enough parallax, not so many that COLMAP drags. Bump to 500 for more detail, 150 if the video is very short.
- `--matching-method sequential`: for a video where frames are in temporal order, sequential matching is ~5× faster than exhaustive and just as accurate.

Runtime on a 5070 Ti: ~3–8 minutes (most of it is COLMAP feature matching).

If COLMAP fails to register most frames, try `--matching-method exhaustive` (slower but handles loop closures and repetitive textures better).

### Step 2 — Train splatfacto

```powershell
ns-train splatfacto --data data\street --output-dir outputs\street
```

- **Default `splatfacto`**: ~15–25 min on a 5070 Ti, ~1–3 M Gaussians, ~200–400 MB `.ply`.
- **`splatfacto-big`** for higher fidelity: add `--pipeline.model.use-bilateral-grid True` and use `ns-train splatfacto-big --data data\street`. ~40–60 min, ~5–10 M Gaussians, larger output.

Training logs to a Viser viewer — open the URL it prints (usually `http://localhost:7007`) in a browser to watch the splats converge live.

### Step 3 — Export `.ply`

```powershell
# find the run directory (timestamped), e.g.:
# outputs\street\splatfacto\2026-04-18_120000
ns-export gaussian-splat `
  --load-config outputs\street\splatfacto\<RUN-TIMESTAMP>\config.yml `
  --output-dir exports\street
```

Output: `exports\street\splat.ply`.

### Step 4 — Drop into the website

```powershell
copy exports\street\splat.ply ..\website\public\splats\scene.ply
```

Then edit [`website/src/components/SplatViewer.js`](../website/src/components/SplatViewer.js):

```js
const USE_REAL_SPLAT = true;
const SPLAT_PATH = '/splats/scene.ply';
```

```powershell
cd ..\website
npm install
npm run dev
```

Open `http://localhost:3000` — the splat scene should render in the `SplatViewer` component.

---

## Quality tips (if the first run looks bad)

- **Motion blur / rolling shutter**: iPhone video at 30 fps has some rolling shutter. If reconstruction is soft, re-capture at 60 fps with the phone moving slowly — consistent motion beats fast panning every time.
- **Insufficient coverage**: you need ~360° of baseline around whatever you want sharp. Walking one-way down a street gives a good facade on one side, weak depth on the other. For a proper streetscape, walk down and back, or down both sides.
- **Texture-poor surfaces** (plain walls, sky): COLMAP can't find features there. Include more surroundings (tree leaves, parked cars, street markings) to anchor the SfM.
- **Too few frames**: bump `--num-frames-target` to 500–800 for longer videos.
- **Bad SfM (few registered cameras)**: switch to `--matching-method exhaustive`, or clean the data with `ns-process-data video --crop-factor 0.0 0.0 0.0 0.0` to use the full frame.

## Alternatives worth knowing about (per `3D-Worlds/gaussian-splatting-sota.md`)

- **Brush** (Rust/WebGPU) — no COLMAP needed, cross-platform. Great as a fallback on Mac if you ever want to iterate without the Windows box. Lower quality ceiling than nerfstudio on dense scenes.
- **Scaniverse 4 / Polycam** — iPhone apps. If you re-capture with these instead of QuickTime's built-in video, you skip this whole pipeline and get a splat directly on the phone. Use for fast iteration on new scenes.
- **Spark 2.0** (SparkJS) — browser renderer with streaming LoD for 100M+ splat worlds. Worth swapping in as the website renderer once scenes get big.

---

## File layout

```
pipeline/
  input/
    IMG_4588.MOV          # source video (tracked)
  data/                   # ns-process-data output: frames + colmap/  (gitignored)
  outputs/                # ns-train output: checkpoints + configs    (gitignored)
  exports/                # ns-export output: .ply splats              (gitignored)
  README.md               # this file
```

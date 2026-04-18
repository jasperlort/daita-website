# DAITA

Two halves:

- **[`website/`](website/)** — Next.js marketing site. Includes a `SplatViewer` component that can render a real `.ply` / `.splat` file from `website/public/splats/` once the pipeline produces one.
- **[`pipeline/`](pipeline/)** — 3D reconstruction pipeline. Takes a phone video and produces a 3D Gaussian Splat scene. Runs on Windows with CUDA (RTX 5070 Ti tested).

## Quick start

### Website (Mac / any platform)

```bash
cd website
npm install
npm run dev
```

### Pipeline (Windows, CUDA)

See [`pipeline/README.md`](pipeline/README.md) for the full recipe. Short version:

```powershell
cd pipeline
# one-time environment setup (see pipeline/README.md)
ns-process-data video --data input\IMG_4588.MOV --output-dir data\street --num-frames-target 300
ns-train splatfacto --data data\street
ns-export gaussian-splat --load-config outputs\street\splatfacto\<RUN>\config.yml --output-dir exports\street
# drop the exported splat into the website
copy exports\street\splat.ply ..\website\public\splats\scene.ply
```

Then flip `USE_REAL_SPLAT = true` and `SPLAT_PATH = '/splats/scene.ply'` in [`website/src/components/SplatViewer.js`](website/src/components/SplatViewer.js).

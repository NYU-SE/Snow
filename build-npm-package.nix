{
  lib,
  fetchurl,
  writeTextFile,
  stdenv,
  nodejs,
  runCommandLocal,
}:
with lib;
  {
    src,
    extraEnv ? {},
  }: let
    lockfile = importJSON "${src}/package-lock.json";
    nodeModules = let
      deps = builtins.attrValues (removeAttrs lockfile.packages [""]);
      tarballs = map (p:
        fetchurl {
          url = p.resolved;
          hash = p.integrity;
        })
      deps;
      tarballsFile = writeTextFile {
        name = "tarballs";
        text = builtins.concatStringsSep "\n" tarballs + "\n";
      };
      npmCache = runCommandLocal "npm-cache" {buildInputs = [nodejs];} ''
        mkdir -p $out
        export HOME=$PWD/.home
        export npm_config_cache=$out
        while read package
        do
          echo "caching $package"
          npm cache add "$package"
        done < ${tarballsFile}
      '';
    in
      stdenv.mkDerivation {
        inherit (lockfile) name version;
        inherit src;
        env = extraEnv;

        nativeBuildInputs = [nodejs];
        buildPhase = ''
          export HOME=$PWD/.home
          export npm_config_cache="$PWD/.npm"
          ln -s ${npmCache} $PWD/.npm

          npm ci --offline
          patchShebangs .
          npm run build
        '';
        installPhase = ''
          mv dist $out
        '';
      };
  in
    nodeModules

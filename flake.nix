{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable-small";

  outputs = {
    self,
    nixpkgs,
  }: let
    sys = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${sys};
    buildNpmPackage = pkgs.callPackage ./build-npm-package.nix {};
    mkApp = exe: {
      type = "app";
      program = toString exe;
    };

    apiAddr = "127.0.0.1:8000";
    apiHost = "http://${apiAddr}";
  in {
    formatter.${sys} = pkgs.alejandra;
    packages.${sys} = {
      python = pkgs.python3.withPackages (p: with p; [django django-cors-headers pillow schema]);
      website = buildNpmPackage {
        src = ./frontend/website;
        extraEnv.VITE_SNOW_API_SERVER = "${apiHost}/api";
      };
    };
    apps.${sys} = let
      inherit (self.packages.${sys}) python;
      api = pkgs.writeShellScript "snow-api" ''
        export SNOW_API_HOST="${apiHost}"
        export SNOW_API_WORKDIR=$PWD
        ${python}/bin/python ${self}/manage.py migrate
        ${python}/bin/python ${self}/manage.py runserver "${apiAddr}"
      '';
      backend-test = pkgs.writeShellScript "snow-test" ''
        export SNOW_API_HOST="${apiHost}"
        export SNOW_API_WORKDIR=$PWD
        ${python}/bin/python ${self}/manage.py test "$@"
      '';
      website = pkgs.writeShellScript "snow-website" ''
        ${python}/bin/python -m http.server --directory ${self.packages.${sys}.website} -b 127.0.0.1 5173
      '';
    in {
      api = mkApp api;
      website = mkApp website;
      backend-test = mkApp backend-test;
    };
  };
}

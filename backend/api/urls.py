from django.urls import path

import inspect
from pkgutil import iter_modules
from importlib import import_module

import api.impl

urlpatterns = []

# Automatically discover API definitions
# by `api_path` attribute of functions
for module in iter_modules(api.impl.__path__):
    submodule = import_module(f"api.impl.{module.name}")
    members = inspect.getmembers(submodule)

    prefix = "";
    api_funcs = [];
    for k, v in members:
        if k == 'API_PREFIX' and type(v) == str:
            prefix = v
        if inspect.isfunction(v) and hasattr(v, 'api_path'):
            api_funcs.append(v)

    for api_func in api_funcs:
        urlpatterns.append(path(f"{prefix}{api_func.api_path}", api_func))

export async function loadNetCDF(fn: string) {
    // const {loadPyodide } = await import('pyodide')
    // const pyodide = await loadPyodide();
const {loadPyodide } = require('pyodide')
const pyodide = await loadPyodide()

// TODO wheels are cached in node_modules/pyodide/ , we should have npm run script to download use wheels
await pyodide.loadPackage(["xarray", "netcdf4"]);
// Gives Uncaught Error: No known package with name 'netcdf4'
// await pyodide.loadPackage(["netcdf4"]);
// Uncaught Error: No known package with name 'h5netcdf'
// await pyodide.loadPackage(["h5netcdf"]);

// Gives ValueError: Can't find a pure Python 3 wheel for 'netcdf4'.
// await pyodide.loadPackage(["micropip"]);
// const micropip = pyodide.pyimport("micropip");
// micropip.install("netcdf4");

// See https://github.com/pyodide/pyodide/pull/3910

/*

netcdf4 wheel is not included in https://github.com/pyodide/pyodide/releases/download/0.23.4/pyodide-0.23.4.tar.bz2
Build locally with

git clone https://github.com/pyodide/pyodide
cd pyodide
./run_docker
pip install -e pyodide-build
make -C emsdk
make -C cpython
pyodide build-recipes netcdf4 --install
pyodide build-recipes cftime --install
pyodide build-recipes xarray --install

make
pyodide venv venv
. venv/bin/activate
pip install packages/cftime/dist/cftime-1.6.2-cp311-cp311-emscripten_3_1_43_wasm32.whl 
pip install packages/netcdf4/dist/netCDF4-1.6.3-cp311-cp311-emscripten_3_1_43_wasm32.whl 
pip install packages/xarray/dist/xarray-2023.6.0-py3-none-any.whl
docker cp data/xr_total4.nc 76ff65ce78d8:/src/xr_total4.nc
python
import xarray as xr
# Gives Error: Dynamic linking error: cannot resolve symbol H5get_libversion
from netCDF4 import Dataset
# Gives Error: Dynamic linking error: cannot resolve symbol H5get_libversion


# Copy wheels out of docker container to ./pyartifacts/
docker cp 76ff65ce78d8:/src/packages/netcdf4/dist/netCDF4-1.6.3-cp311-cp311-emscripten_3_1_43_wasm32.whl ./pyartifacts/
docker cp 76ff65ce78d8:/src/packages/libhdf5/dist/libhdf5-1.12.1.zip ./pyartifacts/
docker cp 76ff65ce78d8:/src/packages/libnetcdf/dist/libnetcdf-4.9.2.zip ./pyartifacts/
*/

// await micropip.install("file://pyartifacts/netCDF4-1.6.3-cp311-cp311-emscripten_3_1_43_wasm32.whl");
// Gives Uncaught Error: bad export type for `H5T_NATIVE_INT_g`: undefined

const xarray = pyodide.pyimport("xarray");
// Gives ValueError: Wheel was built with Emscripten v3.1.43 but Pyodide was built with Emscripten v3.1.32

const mountDir = "/mnt";
pyodide.FS.mkdir(mountDir);
pyodide.FS.mount(pyodide.FS.filesystems.NODEFS, { root: "../data" }, mountDir);

const ds = xarray.open_dataset('/mnt/xr_total4.nc')
return ds
}

/*
The following packages are already built: cftime, distutils, hashlib, libhdf5, libiconv, liblzma, libnetcdf, libxml, lzma, micropip, netcdf4, numpy, openssl, packaging, pkgconfig, pydecimal, pydoc_data, sqlite3, ssl, test, and zlib             
Building the following packages: h5py                                                                                                                                                                                                               
[1/1] (thread 1) building h5py ⠼       

                                                                                                                                                                                                       
h5py/_conv.pyx:647:18: 'py_create' is not a constant, variable or function identifier                                                                                                                  
                                                                                                                                                                                                       
Error compiling Cython file:                                                                                                                                                                           
------------------------------------------------------------                                                                                                                                           
...                                                                                                                                                                                                    
        PyObject *pdata_elem                                                                                                                                                                           
        char* buf = <char*>buf_i                                                                                                                                                                       
                                                                                                                                                                                                       
    if command == H5T_CONV_INIT:                                                                                                                                                                       
        cdata[0].need_bkg = H5T_BKG_NO                                                                                                                                                                 
        if not H5Tequal(src_id, H5PY_OBJ) or H5Tget_class(dst_id) != H5T_VLEN:                                                                                                                         
                                ^                                                                                                                                                                      
------------------------------------------------------------                                                                                                                                           
                                                                                                                                                                                                       
h5py/_conv.pyx:761:32: 'H5PY_OBJ' is not a constant, variable or function identifier                                                                                                                   
                                                                                                                                                                                                       
Error compiling Cython file:                                                                                                                                                                           
------------------------------------------------------------                                                                                                                                           
...                                                                                                                                                                                                    
                                                                                                                                                                                                       
    if command == H5T_CONV_INIT:                                                                                                                                                                       
        cdata[0].need_bkg = H5T_BKG_NO                                                                                                                                                                 
        if not H5Tequal(src_id, H5PY_OBJ) or H5Tget_class(dst_id) != H5T_VLEN:                                                                                                                         
            return -2                                                                                                                                                                                  
        supertype = typewrap(H5Tget_super(dst_id))                                                                                                                                                     
                    ^                                                                                                                                                                                  
------------------------------------------------------------                                                                                                                                           
                                                                                                                                                                                                       
h5py/_conv.pyx:763:20: 'typewrap' is not a constant, variable or function identifier                                                                                                                   
                                                                                                                                                                                                       
Error compiling Cython file:                                                                                                                                                                           
------------------------------------------------------------                                                                                                                                           
...                                                                                                                                                                                                    
            return -2                                                                                                                                                                                  
        supertype = typewrap(H5Tget_super(dst_id))                                                                                                                                                     
        for i in range(nl):                                                                                                                                                                            
            # smells a lot                                                                                                                                                                             
            memcpy(&pdata_elem, pdata+i, sizeof(pdata_elem))                                                                                                                                           
            if supertype != py_create((<cnp.ndarray> pdata_elem).dtype, 1):                                                                                                                            
                            ^                                                                                                                                                                          
------------------------------------------------------------                                                                                                                                           
                                                                                                                                                                                                       
h5py/_conv.pyx:767:28: 'py_create' is not a constant, variable or function identifier                                                                                                                  
                                                                                                                                                                                                       
Error compiling Cython file:                                                                                                                                                                           
------------------------------------------------------------                                                                                                                                           
...                                                                                                                                                                                                    
        if nl == 0:                                                                                                                                                                                    
            return 0                                                                                                                                                                                   
                                                                                                                                                                                                       
        # need to pass element dtype to converter                                                                                                                                                      
        pdata_elem = pdata[0]                                                                                                                                                                          
        supertype = py_create((<cnp.ndarray> pdata_elem).dtype)                                                                                                                                        
                    ^                                                                                                                                                                                  
------------------------------------------------------------                                                                                                                                           
                                                                                                                                                                                                       
h5py/_conv.pyx:784:20: 'py_create' is not a constant, variable or function identifier                                                                                                                  
                                                                                                                                                                                                       
Error compiling Cython file:                                                                                                                                                                           
------------------------------------------------------------                                                                                                                                           
...                                                                                                                                                                                                    
            return 0                                                                                                                                                                                   
                                                                                                                                                                                                       
        # need to pass element dtype to converter                                                                                                                                                      
        pdata_elem = pdata[0]                                                                                                                                                                          
        supertype = py_create((<cnp.ndarray> pdata_elem).dtype)                                                                                                                                        
        outtype = typewrap(H5Tget_super(dst_id))                                                                                                                                                       
                  ^                                                                                                                                                                                    
------------------------------------------------------------                                                                                                                                           
                                                                                                                                                                                                       
h5py/_conv.pyx:785:18: 'typewrap' is not a constant, variable or function identifier                                                                                                                   
                                                                                                                                                                                                       
Error compiling Cython file:                                                                                                                                                                           
------------------------------------------------------------                                                                                                                                           
...                                                                                                                                                                                                    
                                                                                                                                                                                                       
    enum = H5Tenum_create(H5T_STD_I32LE)                                                                                                                                                               
                                                                                                                                                                                                       
    vlentype = H5Tvlen_create(H5T_STD_I32LE)                                                                                                                                                           
                                                                                                                                                                                                       
    pyobj = H5PY_OBJ                                                                                                                                                                                   
            ^                                                                                                                                                                                          
------------------------------------------------------------                                                                                                                                           
                                                                                                                                                                                                       
h5py/_conv.pyx:894:12: 'H5PY_OBJ' is not a constant, variable or function identifier                                                                                                                   
********************************************************************************                                                                                                                       
                       Summary of the h5py configuration                                                                                                                                               
                                                                                                                                                                                                       
HDF5 include dirs: [                                                                                                                                                                                   
  '/src/packages/.libs/include'                                                                                                                                                                        
]                                                                                                                                                                                                      
HDF5 library dirs: [                                                                                                                                                                                   
  '/src/packages/.libs/lib'                                                                                                                                                                            
]                                                                                                                                                                                                      
     HDF5 Version: (1, 12, 1)                                                                                                                                                                          
      MPI Enabled: False                                                                                                                                                                               
 ROS3 VFD Enabled: False                                                                                                                                                                               
DIRECT VFD Enabled: False                                                                                                                                                                              
 Rebuild Required: True                                                                                                                                                                                
                                                                                                                                                                                                       
********************************************************************************                                                                                                                       
Executing api_gen rebuild of defs                                                                                                                                                                      
Updated /src/packages/h5py/build/h5py-3.7.0/h5py/config.pxi                                                                                                                                            
Executing cythonize()                                                                                                                                                                                  
[ 1/24] Cythonizing /src/packages/h5py/build/h5py-3.7.0/h5py/_conv.pyx                                                                                                                                 
Traceback (most recent call last):                                                                                                                                                                     
  File "/usr/local/lib/python3.11/site-packages/pep517/in_process/_in_process.py", line 351, in <module>                                                                                               
    main()                                                                                                                                                                                             
  File "/usr/local/lib/python3.11/site-packages/pep517/in_process/_in_process.py", line 333, in main                                                                                                   
    json_out['return_val'] = hook(**hook_input['kwargs'])                                                                                                                                              
                             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^                                                                                                                                              
  File "/usr/local/lib/python3.11/site-packages/pep517/in_process/_in_process.py", line 249, in build_wheel                                                                                            
    return _build_backend().build_wheel(wheel_directory, config_settings,                                                                                                                              
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^                                                                                                                              
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/build_meta.py", line 434, in build_wheel                                                                                       
    return self._build_with_temp_dir(                                                                                                                                                                  
           ^^^^^^^^^^^^^^^^^^^^^^^^^^                                                                                                                                                                  
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/build_meta.py", line 419, in _build_with_temp_dir                                                                              
    self.run_setup()                                                                                                                                                                                   
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/build_meta.py", line 341, in run_setup                                                                                         
    exec(code, locals())                                                                                                                                                                               
  File "<string>", line 104, in <module>                                                                                                                                                               
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/__init__.py", line 107, in setup                                                                                               
    return distutils.core.setup(**attrs)                                                                                                                                                               
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^                                                                                                                                                               
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/_distutils/core.py", line 185, in setup                                                                                        
    return run_commands(dist)                                                                                                                                                                          
           ^^^^^^^^^^^^^^^^^^                                                                                                                                                                          
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/_distutils/core.py", line 201, in run_commands                                                                                 
    dist.run_commands()                                                                                                                                                                                
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/_distutils/dist.py", line 969, in run_commands                                                                                 
    self.run_command(cmd)                                                                                                                                                                              
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/dist.py", line 1233, in run_command                                                                                            
    super().run_command(command)                                                                                                                                                                       
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/_distutils/dist.py", line 988, in run_command                                                                                  
    cmd_obj.run()                                                                                                                                                                                      
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/wheel/bdist_wheel.py", line 364, in run                                                                                                   
    self.run_command("build")                                                                                                                                                                          
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/_distutils/cmd.py", line 318, in run_command                                                                                   
    self.distribution.run_command(command)                                                                                                                                                             
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/dist.py", line 1233, in run_command                                                                                            
    super().run_command(command)                                                                                                                                                                       
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/_distutils/dist.py", line 988, in run_command                                                                                  
    cmd_obj.run()                                                                                                                                                                                      
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/_distutils/command/build.py", line 131, in run                                                                                 
    self.run_command(cmd_name)                                                                                                                                                                         
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/_distutils/cmd.py", line 318, in run_command                                                                                   
    self.distribution.run_command(command)                                                                                                                                                             
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/dist.py", line 1233, in run_command                                                                                            
    super().run_command(command)                                                                                                                                                                       
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/setuptools/_distutils/dist.py", line 988, in run_command                                                                                  
    cmd_obj.run()                                                                                                                                                                                      
  File "/src/packages/h5py/build/h5py-3.7.0/setup_build.py", line 166, in run                                                                                                                          
    self.extensions = cythonize(self._make_extensions(config),                                                                                                                                         
                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^                                                                                                                                         
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/Cython/Build/Dependencies.py", line 1134, in cythonize                                                                                    
    cythonize_one(*args)                                                                                                                                                                               
  File "/tmp/build-env-kok4o73m/lib/python3.11/site-packages/Cython/Build/Dependencies.py", line 1301, in cythonize_one                                                                                
    raise CompileError(None, pyx_file)                                                                                                                                                                 
Cython.Compiler.Errors.CompileError: /src/packages/h5py/build/h5py-3.7.0/h5py/_conv.pyx                                                                                                                
* Creating virtualenv isolated environment...                                                                                                                                                          
* Installing packages in isolated environment... (Cython >=0.29.14; python_version=='3.8', Cython >=0.29.15; python_version>='3.9', Cython >=0.29; python_version<'3.8', pkgconfig, setuptools, wheel) 
* Getting dependencies for wheel...                                                                                                                                                                    
* Installing packages in isolated environment... (wheel)                                                                                                                                               
* Building wheel...                                                                                                                                                                                    
                                                                                                                                                                                                       
ERROR Backend subproccess exited when trying to invoke build_wheel                                                                                                                                     
[2023-08-24 08:43:47] Succeeded building package h5py in 4.3 seconds.  

*/
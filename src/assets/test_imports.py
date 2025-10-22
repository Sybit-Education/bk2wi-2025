import sys
print("Python executable:", sys.executable)
print("Python version:", sys.version)
print("Python path:", sys.path)

try:
    import shapely
    print("Shapely version:", shapely.__version__)
except ImportError:
    print("Shapely not found")

try:
    import pyproj
    print("Pyproj version:", pyproj.__version__)
except ImportError:
    print("Pyproj not found")

import sys, numpy as np
from skimage import io
ims=[io.imread(f) for f in sys.argv[2:]]
io.imsave(sys.argv[1], np.concatenate([i[...,:3] for i in ims],1))

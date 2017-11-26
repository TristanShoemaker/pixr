import argparse
import sys
import os
import time
import numpy as np
from PIL import Image, ImageFilter
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from matplotlib.colors import rgb2hex

def matGetImg(path):
    return mpimg.imread(path)

def pilGetImg(path):
    return Image.open(path)

def lummapfunc(path,colour):
    img = matGetImg(path)

    if colour == 'r':
        img = img[:,:,0]
    if colour == 'g':
        img = img[:,:,1]
    if colour == 'b':
        img = img[:,:,2]

    fig = plt.imshow(img, cmap='hot')
    plt.colorbar(fig,fraction=0.046, pad=0.04)
    plt.axis('off')
    fig.axes.get_xaxis().set_visible(False)
    fig.axes.get_yaxis().set_visible(False)

    pathHead, pathTail = os.path.split(path)
    newPath = path[:-4] + '_analysis/' + pathTail[:-4] + '_lum' + '_' + colour + '.png'
    plt.savefig(newPath, bbox_inches='tight', pad_inches = 0)
    print(newPath)

def contourfunc(path):
    img = pilGetImg(path)

    img = img.filter(ImageFilter.CONTOUR)

    pathHead, pathTail = os.path.split(path)
    newPath = path[:-4] + '_analysis/' + pathTail[:-4] + '_contourFilter' + '.png'
    img.save(newPath)
    print(newPath)

def medianfunc(path):
    img = matGetImg(path)
    median = np.median(img, axis=(0,1))
    median = rgb2hex(median)
    return median

def cintensityfunc(path,colour):
    img = matGetImg(path)

    if colour == 'r':
        img = img[:,:,0]
        mean = rgb2hex([np.mean(img, axis=(0,1)),0,0])

    if colour == 'g':
        img = img[:,:,1]
        mean = rgb2hex([0,np.mean(img, axis=(0,1)),0])

    if colour == 'b':
        img = img[:,:,2]
        mean = rgb2hex([0,0,np.mean(img, axis=(0,1))])

    return mean

def meanfunc(path):
    img = matGetImg(path)
    mean = np.mean(img, axis=(0,1))
    mean = rgb2hex(mean)
    return  mean

def masterfunc(path):
    pathHead, pathTail = os.path.split(path)

    data = []
    data.append('imgname=' + pathTail[:-4] + '&')
    data.append('mean=' + meanfunc(path) + '&')
    data.append('median=' + medianfunc(path) + '&')
    data.append('rval=' + cintensityfunc(path,'r') + '&')
    data.append('bval=' + cintensityfunc(path,'g') + '&')
    data.append('gval=' + cintensityfunc(path,'b') + '&')

    print(''.join(data))

if __name__ ==  "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument('path')
    parser.add_argument('--masterdata',action='store_true',help='get all image data')
    parser.add_argument('--lummap',help='luminosity map of r, g, or b')
    parser.add_argument('--contour',action='store_true',help='image filter contour')
    parser.add_argument('--median',action='store_true',help='median colour')
    parser.add_argument('--cintensity',help='intensity of specfic color r, g, or b')
    parser.add_argument('--mean',action='store_true',help='mean colour')

    args = parser.parse_args()
    filePath = args.path

    if not os.path.exists(filePath[:-4] + '_analysis'):
        os.makedirs(filePath[:-4] + '_analysis')

    if filePath[-4:] != '.png':
        pilGetImg(filePath).save(filePath[:-4] + '.png')
        os.remove(filePath)
        filePath = filePath[:-4] + '.png'

    if args.masterdata:
        masterfunc(filePath)

    if args.lummap:
        lummapfunc(filePath,args.lummap)

    if args.contour:
        contourfunc(filePath)

    if args.median:
        medianfunc(filePath)

    if args.cintensity:
        cintensityfunc(filePath,args.cintensity)

    if args.mean:
        meanfunc(filePath)

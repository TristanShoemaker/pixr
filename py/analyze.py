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

def lummapfunc(path):
    img = matGetImg(path)

    for i in range(0,3):
        if i == 0:
            cmaps='YlOrRd'
            #title='Red Luminosity'
        if i == 1:
            cmaps='Greens'
            #title='Green Luminosity'
        if i == 2:
            cmaps='Blues'
            #title='Blue Luminosity'

        fig = plt.imshow(img[:,:,i], cmap=cmaps)
        #plt.colorbar(fig,fraction=0.046, pad=0.04)
        plt.axis('off')
        #plt.title(title)
        fig.axes.get_xaxis().set_visible(False)
        fig.axes.get_yaxis().set_visible(False)

        pathHead, pathTail = os.path.split(path)
        newPath = path[:-4] + '_analysis/' + pathTail[:-4] + '_lummap' + '_' + str(i) + '.png'
        plt.savefig(newPath, bbox_inches='tight', pad_inches = 0)

    print('success')

def contourfunc(path):
    img = pilGetImg(path)

    img = img.filter(ImageFilter.CONTOUR)

    pathHead, pathTail = os.path.split(path)
    newPath = path[:-4] + '_analysis/' + pathTail[:-4] + '_contour' + '.png'
    img.save(newPath)

    print('success')

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

    return mean

def freqfunc(path):
    im = Image.open(path)
    histo = im.histogram()
    histor = histo[0:255]
    histog = histo[256:511]
    histob = histo[512:767]
    histo[512]=0

    plt.figure()
    plt.gca().set_ylim([0,max(histo)+50])
    plt.gca().set_xlim([0,255])

    plt.fill_between(range(0,255),0,histor, color='red', alpha=0.3)
    plt.fill_between(range(0,255),0,histog, color='green', alpha=0.3)
    plt.fill_between(range(0,255),0,histob, color='blue', alpha=0.3)
    #plt.show()

    pathHead, pathTail = os.path.split(path)
    newPath = path[:-4] + '_analysis/' + pathTail[:-4] + '_freq' + '.png'
    plt.savefig(newPath)

    return 'success'

def modefunc(path,colour):
    BINSIZE = 32
    bins = [] 
    bincolours = range(BINSIZE//2,255,BINSIZE) #careful with the int division!
    im = Image.open(path)
    histo = im.histogram()

    histo[512] = 0

    if colour == 'r':
        histo = histo[0:255]
        for i in range(0,256//BINSIZE):
            bins.append(sum(histo[(i * BINSIZE):(((i + 1) * BINSIZE) - 1)]))
        colour = bincolours[max(range(len(bins)), key=bins.__getitem__)] / 255.0
        value = rgb2hex([colour,0,0])
    if colour == 'g':
        histo = histo[256:512]
        for i in range(0,256//BINSIZE):
            bins.append(sum(histo[(i * BINSIZE):(((i + 1) * BINSIZE) - 1)]))
        colour = bincolours[max(range(len(bins)), key=bins.__getitem__)] / 255.0
        value = rgb2hex([0,colour,0])
    if colour == 'b':
        histo = histo[512:767]
        for i in range(0,256//BINSIZE):
            bins.append(sum(histo[(i * BINSIZE):(((i + 1) * BINSIZE) - 1)]))
        colour = bincolours[max(range(len(bins)), key=bins.__getitem__)] / 255.0
        value = rgb2hex([0,0,colour])

   # print value
    return value

def histofunc(path):
    BINSIZE = 32
    bincolours = range(BINSIZE/2,255,BINSIZE)
    im = Image.open(path)
    histo = im.histogram()
    histo[512] = 0

    histo = histo[0:255]
    bins = []
    fig1 = plt.figure()
    for i in range(0,256/BINSIZE):
        bins.append(sum(histo[(i * BINSIZE):(((i + 1) * BINSIZE) - 1)]))
    barlist = plt.bar(range(0,8),bins)
    for i in range(0,256/BINSIZE):
        barlist[i].set_color(rgb2hex([bincolours[i]/255.0,0,0]))
    pathHead, pathTail = os.path.split(path)
    newPath = path[:-4] + '_analysis/' + pathTail[:-4] + '_histo' + '_0' + '.png'
    plt.savefig(newPath, bbox_inches='tight', pad_inches = 0)

    histo = im.histogram()
    histo = histo[256:511]
    bins = []
    fig2 = plt.figure()
    for i in range(0,256/BINSIZE):
        bins.append(sum(histo[(i * BINSIZE):(((i + 1) * BINSIZE) - 1)]))
    barlist2 = plt.bar(range(0,8),bins)
    for i in range(0,256/BINSIZE):
        barlist2[i].set_color(rgb2hex([0,bincolours[i]/255.0,0]))
    pathHead, pathTail = os.path.split(path)
    newPath = path[:-4] + '_analysis/' + pathTail[:-4] + '_histo' + '_1' + '.png'
    plt.savefig(newPath, bbox_inches='tight', pad_inches = 0)

    histo = im.histogram()
    histo = histo[512:767]
    bins = []
    fig3 = plt.figure()
    for i in range(0,256/BINSIZE):
        bins.append(sum(histo[(i * BINSIZE):(((i + 1) * BINSIZE) - 1)]))
    barlist3 = plt.bar(range(0,8),bins)
    for i in range(0,256/BINSIZE):
        barlist3[i].set_color(rgb2hex([0,0,bincolours[i]/255.0]))
    pathHead, pathTail = os.path.split(path)
    newPath = path[:-4] + '_analysis/' + pathTail[:-4] + '_histo' + '_2' + '.png'
    plt.savefig(newPath, bbox_inches='tight', pad_inches = 0)

def masterfunc(path):
    pathHead, pathTail = os.path.split(path)

    data = []
    data.append('imgname=' + pathTail[:-4] + '&')
    data.append('mean=' + meanfunc(path) + '&')
    data.append('median=' + medianfunc(path) + '&')
    data.append('rmean=' + cintensityfunc(path,'r') + '&')
    data.append('gmean=' + cintensityfunc(path,'g') + '&')
    data.append('bmean=' + cintensityfunc(path,'b') + '&')
    data.append('rmode=' + modefunc(path,'r') + '&')
    data.append('gmode=' + modefunc(path,'g') + '&')
    data.append('bmode=' + modefunc(path,'b') + '&')

    print(''.join(data))

if __name__ ==  "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument('path')
    parser.add_argument('--masterdata',action='store_true',help='get all image data')
    parser.add_argument('--lummap',action='store_true',help='luminosity map r, g, and b')
    parser.add_argument('--contour',action='store_true',help='image filter contour')
    parser.add_argument('--median',action='store_true',help='median colour')
    parser.add_argument('--cintensity',help='intensity of specfic color r, g, or b')
    parser.add_argument('--mean',action='store_true',help='mean colour')
    parser.add_argument('--freq',action='store_true',help='generate colour frequency plot')
    parser.add_argument('--mode',help='mode colour of r, g or b')
    parser.add_argument('--histo',action="store_true",help="histograms of r g and b")

    args = parser.parse_args()
    filePath = args.path
    fileNameNoExt = os.path.splitext(filePath)[0]

    if not os.path.exists(fileNameNoExt + '_analysis'):
        os.makedirs(fileNameNoExt + '_analysis')

    if os.path.splitext(filePath)[1] != '.png':
        pilGetImg(filePath).save(fileNameNoExt + '.png')
        os.remove(filePath)
        filePath = fileNameNoExt + '.png'

    if args.masterdata:
        masterfunc(filePath)

    if args.lummap:
        lummapfunc(filePath)

    if args.contour:
        contourfunc(filePath)

    if args.median:
        medianfunc(filePath)

    if args.cintensity:
        cintensityfunc(filePath,args.cintensity)

    if args.mean:
        meanfunc(filePath)

    if args.freq:
        freqfunc(filePath)

    if args.mode:
        modefunc(filePath,args.mode)

    if args.histo:
        histofunc(filePath)
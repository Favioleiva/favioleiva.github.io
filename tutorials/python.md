---
layout: default
title: "Python"
permalink: /tutorials/python
---
<center> <h1>Python</h1> </center>

## 1. How to extract data from a PDF using Tabula
To extract tables from PDFs, Tabula is an amazing tool that lets you convert tables into CSV or Excel files. Start by installing Tabula for Python (tabula-py) and, if your PDF is large, consider organizing it into sections. Then, load a section into Tabula, select the table area, and choose the extraction mode (*stream* or *lattice*) based on the format. Export as CSV and tidy up the columns in Excel if needed. Tabula is great for small tables with readable information (not for image data), though larger PDFs might require extra adjustments. Here’s a quick tutorial to get you started: [Watch the tutorial on Loom](https://www.loom.com/share/5ae760a94d82439797cbe40fe379538a?sid=5b237c92-c65c-455e-99f0-e8186345b69f). 

## 2. How to generate a qr code for a webpage using qrcode and svgwrite libraries in Python (GPT generated code on request by Favio Leiva)

In this code, we are generating a QR code that links to a general URL (`https://favioleiva.github.io/`). The `qrcode` library is used to create the QR code, specifying the version and error correction level. After creating the QR code, we extract its module matrix, which represents the individual black and white modules of the code. Using the `svgwrite` library, we create an SVG file where each module is drawn as a rounded rectangle. The size of each module is adjusted based on the matrix dimensions. Finally, the SVG file is saved as 'rounded_qr.svg', which can be viewed directly in a browser or SVG editor. Change the name of the URL and the ouput for your own convenience. 

You can view and try the full code in the [QrCode.ipynb notebook](tutorials/python/QrCode.ipynb).

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

You can view and try the full code [here](https://github.com/Favioleiva/favioleiva.github.io/blob/c24823d28d6d8d8cb278ac4e66e88f96ca938671/tutorials/python/QrCode.ipynb)

## 3. Mankiw, Romer and Weil (1992). The Solow Growth Model and its Convergence Prediction. A replication with Python

I updated Professor Méndez’s original R code to Python. The empirical analysis of economic growth presented by Mankiw, Romer, and Weil (1992), focusing on the Solow Growth Model, is replicated here. This Python implementation allows us to explore the Solow model’s alignment with cross-country data, including the augmented Solow model and its implications for convergence in living standards—specifically, whether poorer countries tend to grow faster than richer ones. In the notebook, code is included to read and manipulate a Stata dataset, define the key variables of the Solow model, run both unrestricted and restricted regressions, conduct F-tests to evaluate model restrictions, and calculate implied parameters such as alpha and beta. Both conditional and unconditional convergence are assessed, with relevant visualizations provided. The translation of the code into Python was completed with the assistance of ChatGPT. 

You can view and try the full code [here](https://colab.research.google.com/drive/1mTgF08Jbf6oNxONbGHyWJZrkygiX0E9N?usp=sharing#scrollTo=EPT2gYvVf_Qk).
You can view additional professor Mendez's tutorials here: [here](https://carlos-mendez.org/).

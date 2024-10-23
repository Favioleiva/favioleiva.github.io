---
layout: default
title: "Excel"
permalink: /tutorials/excel
---
<center> <h1>Excel</h1> </center>

## How to unpivot a table using Power Query in Excel
In this tutorial, I demonstrate how to unpivot a table using an example dataset from Seminario, Zegarra and Palomino (2019). The dataset includes variables like population by region, GDP per capita, and more. I show the process of transforming the pivoted data into an unpivoted version, simplifying it to have one column for the year and one for the variable. No specific action is requested from viewers, just a walkthrough of the unpivoting process.

Here are the steps you followed to **unpivot the table**, based on the transcript provided:

### Steps to Unpivot the Table:

1. **Understand the Data**:
   - You started by explaining that the data is currently in a pivoted form, where different variables (e.g., population by region, GDP per capita, etc.) are spread across columns.

2. **Goal**:
   - The objective was to transform this pivoted data into an **unpivoted** version. In this format, you would have a single column for the year and another column for the variable (e.g., GDP percentage).

3. **Select the Data**:
   - You selected the entire table that you wanted to unpivot.

4. **Open Power Query**:
   - After selecting the table, you navigated to the **Data** tab in Excel and chose the option to load the data from a **range/table** into **Power Query**.

5. **Change Data Types (if needed)**:
   - In Power Query, you modified the data type of certain columns. For instance, you changed the `Ubigeo` (region code) column from a number to text.

6. **Select Columns to Keep**:
   - You selected the columns that you **did not** want to unpivot, such as `Ubigeo`, `Region`, and other identifiers that should remain as is.

7. **Unpivot the Data**:
   - You went to the **Transform** tab in Power Query and chose **Unpivot Other Columns** to unpivot the remaining columns (those with the years).

8. **Review the Result**:
   - The data was unpivoted immediately without needing to write any code. You mentioned that this was straightforward and that you could now see the desired format.

9. **Close and Load**:
   - After reviewing the transformation, you navigated to **Close & Load** to exit Power Query and load the unpivoted data back into Excel.

10. **Review the Output**:
    - The resulting table had one column for the **year** and another column for the **value** (e.g., GDP percentage). You mentioned that you would apply this process to all the variables.

By following these steps, you successfully unpivoted the table, converting the pivoted data into a more manageable, flat format for analysis.

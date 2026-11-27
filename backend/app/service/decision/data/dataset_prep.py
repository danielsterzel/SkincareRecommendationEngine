import pandas as pd
from itertools import chain

# df = pd.read_csv("ingredients.csv", on_bad_lines="skip")
# print(df.columns)
# print(df.head(5))
# print(df['Function'].dtype)
# exploded_functionalities = df['Function'].explode().dropna().str.split(',').to_list()
#
# print(type(exploded_functionalities))
# unique_functions = set(chain.from_iterable(exploded_functionalities))
#
# print(f"Unique functions: {unique_functions}")
# print(df['INCI name'].dropna().unique())

local_df = pd.read_parquet("skincare-products-clean.parquet")
print(local_df.columns)

print(local_df["concentration-ingredient"].dropna().unique())

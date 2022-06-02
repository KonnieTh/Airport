import pandas as pd


airport_before = pd.read_csv('Front-end/data/airports_.csv', header=None)
cols = airport_before.columns.tolist()

cols = [cols[1]]+[cols[4]]+[cols[5]]+[cols[3]]+[cols[2]]

airport_after=airport_before[cols]
airport_after = airport_after.loc[airport_after[4] != '\\N']
airport_after = airport_after.loc[airport_after[5] != '\\N']

airport_after=airport_after.reset_index(drop=True)

airport_after.to_csv('Front-end/data/Airports.csv', index=True)
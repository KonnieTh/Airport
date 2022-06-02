import pandas as pd
import numpy as np

flies_before = pd.read_csv('Front-end/data/flies.csv', header=None)

# cols = routes_before.columns.tolist()
# cols = [cols[0]]+[cols[2]]+[cols[4]]
# routes_after=routes_before[cols]
# routes_after1 = routes_after.loc[routes_after[2] == 'ATH']
# routes_after2 = routes_after.loc[routes_after[4] == 'ATH']
# routes_after=routes_after1.append(routes_after2, ignore_index=True)
# routes_after=routes_after.reset_index(drop=True)


#routes = pd.DataFrame(np.repeat(routes_after.values, 2, axis=0))
#routes.columns = routes_after.columns
#print(newdf)

#airport_after=airport_before[cols]
#airport_after = airport_after.loc[airport_after[4] != '\\N']
#airport_after = airport_after.loc[airport_after[5] != '\\N']

#airport_after=airport_after.reset_index(drop=True)

#routes_after.to_csv('Front-end/data/flies.csv', index=True)
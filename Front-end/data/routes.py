import pandas as pd
import numpy as np

routes_before = pd.read_csv('Front-end/data/routes.csv', header=None)
airlines = pd.read_csv('Front-end/data/Airline.csv', header=None)
airports = pd.read_csv('Front-end/data/Airports.csv', header=None)

cols = routes_before.columns.tolist()
cols = [cols[0]]+[cols[2]]+[cols[4]]
routes_after=routes_before[cols]
routes_after1 = routes_after.loc[routes_after[2] == 'ATH']
routes_after2 = routes_after.loc[routes_after[4] == 'ATH']
routes_after=routes_after1.append(routes_after2, ignore_index=True)
routes_after=routes_after.reset_index(drop=True)


lis=[]
for i in range(len(routes_after)):
    flag=0
    for j in range(len(airlines)):
        if(routes_after.loc[i].at[0]==airlines.loc[j].at[2]):
            lis.append(airlines.loc[j].at[0])
            flag=1
            break
    if(flag==0):
        lis.append("nope")

routes_after[8] = lis
routes_after = routes_after.loc[routes_after[8] != 'nope']
routes_after=routes_after.reset_index(drop=True)
print(routes_after)

newdf = pd.DataFrame(np.repeat(routes_after.values, 2, axis=0))
newdf.columns = routes_after.columns
print(newdf)
# lis=[]
# for i in range(len(routes_after)):
#     flag=0
#     for j in range(len(airports)):
#         if(routes_after.loc[i].at[0]==airports.loc[j].at[2]):
#             lis.append(airlines.loc[j].at[0])
#             flag=1
#             break
#     if(flag==0):
#         lis.append("nope")



#airport_after=airport_before[cols]
#airport_after = airport_after.loc[airport_after[4] != '\\N']
#airport_after = airport_after.loc[airport_after[5] != '\\N']

#airport_after=airport_after.reset_index(drop=True)

#airport_after.to_csv('Front-end/data/airports_fixed.csv', index=True)
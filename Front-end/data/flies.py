import pandas as pd
import requests
import json


routes_before = pd.read_csv('Front-end/data/routes.csv', header=None)
airlines = pd.read_csv('Front-end/data/Airline.csv')
airports = pd.read_csv('Front-end/data/Airports.csv')

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
        if(routes_after.loc[i].at[0]==airlines.loc[j].at['IATA']):
            lis.append(airlines.loc[j].at['airline_ID'])
            flag=1
            break
    if(flag==0):
        lis.append("nope")

routes_after['airline_ID'] = lis
routes_after = routes_after.loc[routes_after['airline_ID'] != 'nope']
routes_after=routes_after.reset_index(drop=True)


lis2=[]
id1=[]
id2=[]
for i in range(len(routes_after)):
    city1=None
    city2=None
    flag=0
    for j in range(len(airports)):
        if(str(routes_after.loc[i].at[2])==str(airports.loc[j].at['IATA'])):
            city1=airports.loc[j].at['city']
            id1.append(airports.loc[j].at['airport_ID'])
        if(str(routes_after.loc[i].at[4])==str(airports.loc[j].at['IATA'])):
            city2=airports.loc[j].at['city']
            id2.append(airports.loc[j].at['airport_ID'])
        if(city1!=None and city2!=None):
            response_API = requests.get('https://gr.distance24.org/route.json?stops='+city1+'|'+city2)
            parse_json = json.loads(response_API.text)
            lis2.append(round(float(parse_json['distance'])/800,3))
            flag=1
            break
    if(flag==0):
        lis2.append("nope")

routes_after['hours'] = lis2
routes_after['airport_ID1']=id1
routes_after['airport_ID2']=id2

routes_after.columns = ["i","airline_IATA","airport1_IATA","airport2_IATA","airline_ID","hours","airport_ID1","airport_ID2"]
routes_after.to_csv('Front-end/data/flies.csv', index=False)
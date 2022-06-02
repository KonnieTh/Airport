import pandas as pd
import math as mt
import random as rd

flies_before = pd.read_csv('Front-end/data/flies.csv')

lis=[]
id=0
for j in range(30):
    for i in range(len(flies_before)):
        for k in range(rd.randint(0,8)):
            month=6
            month_a=month
            flag_d=0
            flag_m=0
            minute_left=rd.randint(0,59)
            hour_left=rd.randint(0,23)
            hours=mt.floor(flies_before.loc[i].at["hours"])
            minutes=mt.ceil(((flies_before.loc[i].at["hours"])%1)*60)
            if(minute_left+minutes>59):
                minute_arrived=minute_left+minutes-59
                hour_arrived=hour_left+hours+1
            else:
                minute_arrived=minute_left+minutes
                hour_arrived=hour_left+hours
            if(hour_arrived>23):
                hour_arrived-=23
                flag_d=1

            if(len(str(hour_left))==1 and len(str(minute_left))!=1):
                time_left="0"+str(hour_left)+":"+str(minute_left)+":00"
            elif(len(str(hour_left))!=1 and len(str(minute_left))==1):
                time_left=str(hour_left)+":0"+str(minute_left)+":00"
            elif(len(str(hour_left))!=1 and len(str(minute_left))!=1):   
                time_left=str(hour_left)+":"+str(minute_left)+":00"
            else:
                time_left="0"+str(hour_left)+":0"+str(minute_left)+":00"
            
            if(len(str(hour_arrived))==1 and len(str(minute_arrived))!=1):
                time_arrived="0"+str(hour_arrived)+":"+str(minute_arrived)+":00"
            elif(len(str(hour_arrived))!=1 and len(str(minute_arrived))==1):
                time_arrived=str(hour_arrived)+":0"+str(minute_arrived)+":00"
            elif(len(str(hour_arrived))!=1 and len(str(minute_arrived))!=1):   
                time_arrived=str(hour_arrived)+":"+str(minute_arrived)+":00"
            else:
                time_arrived="0"+str(hour_arrived)+":0"+str(minute_arrived)+":00"
            day_a=j+1+flag_d
            if(day_a==31 and month==6):
                month_a=7
                day_a="01"
            if(len(str(j))==1 and len(str(month))==1):
                lis.append([id,flies_before.loc[i].at["airport_ID1"],flies_before.loc[i].at["airline_ID"],"2022-0"+str(month)+"-0"+str(j+1),time_left,False])
                lis.append([id,flies_before.loc[i].at["airport_ID2"],flies_before.loc[i].at["airline_ID"],"2022-0"+str(month_a)+"-0"+str(day_a),time_arrived,True])
            elif(len(str(j))!=1 and len(str(month))==1):
                lis.append([id,flies_before.loc[i].at["airport_ID1"],flies_before.loc[i].at["airline_ID"],"2022-0"+str(month)+"-"+str(j+1),time_left,False])
                lis.append([id,flies_before.loc[i].at["airport_ID2"],flies_before.loc[i].at["airline_ID"],"2022-0"+str(month_a)+"-"+str(day_a),time_arrived,True])
            elif(len(str(j))==1 and len(str(month))!=1):
                lis.append([id,flies_before.loc[i].at["airport_ID1"],flies_before.loc[i].at["airline_ID"],"2022-"+str(month)+"-0"+str(j+1),time_left,False])
                lis.append([id,flies_before.loc[i].at["airport_ID2"],flies_before.loc[i].at["airline_ID"],"2022-"+str(month_a)+"-0"+str(day_a),time_arrived,True])
            else:
                lis.append([id,flies_before.loc[i].at["airport_ID1"],flies_before.loc[i].at["airline_ID"],"2022-"+str(month)+"-"+str(j+1),time_left,False])
                lis.append([id,flies_before.loc[i].at["airport_ID2"],flies_before.loc[i].at["airline_ID"],"2022-"+str(month_a)+"-"+str(day_a),time_arrived,True])
            id+=1

flies=pd.DataFrame(lis)
flies.columns = ["flight_ID", "airport_ID", "airline_ID","flight_date","expected_time","is_destination"]

flies.to_csv('Front-end/data/flies_june.csv', index=False)
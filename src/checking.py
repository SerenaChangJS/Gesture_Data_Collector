import json


file_name = 'user_test.json' # change this file name

with open (file_name, 'r') as file:
    file_data = json.load(file)

gestures = [gesture['label']for gesture in file_data]

left = sum(1 for gesture in gestures if gesture == '[')
right = sum(1 for gesture in gestures if gesture == ']')
circle = sum(1 for gesture in gestures if gesture == 'o')

if (len(gestures) == 75) : print ("All 75 data collected.")
else : print (f"Collected {len(gestures)} total data points...")

if (left == 25) : print ("All 25 left brackets collected.")
else : print (f"Collected {left} left bracket data points...")

if (right == 25) : print ("All 25 right brackets collected.")
else : print (f"Collected {right} right bracket data points...")

if (circle == 25) : print ("All 25 circle collected.")
else : print (f"Collected {circle} circle data points...")

import pandas as pd
import numpy as np

def forecast(data=None, target_variable=None, periods=None):
    
    if data == None or target_variable ==None:
        return
    
    data = pd.DataFrame()
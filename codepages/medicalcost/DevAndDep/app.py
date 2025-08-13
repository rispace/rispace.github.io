import streamlit as st
import joblib
import pandas as pd

model = joblib.load('medical_charge_model.pkl')

st.title('Medical Insurance Charges Prediction App')

age = st.number_input('Age', min_value=18, max_value=100, value=30)
bmi = st.number_input('BMI', min_value=10.0, max_value=50.0, value=25.0)
sex = st.selectbox('Sex', options=['male', 'female'])
smoker = st.selectbox('Smoker', options=['yes', 'no'])
children = st.number_input(
    'Number of Children', min_value=0, max_value=5, value=0)
region = st.selectbox(
    'Region', options=['northeast', 'northwest', 'southeast', 'southwest'])

if st.button('Predict'):
    user_data = pd.DataFrame({
        'age': [age],
        'bmi': [bmi],
        'sex': [sex],
        'children': [children],
        'region': [region]
    })

prediction = model.predict(user_data)
predicted_charge = prediction[0]

st.success(f'Estimated Insurance Charge: ${predicted_charge:.2f}')

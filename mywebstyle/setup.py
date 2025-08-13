from setuptools import setup, find_packages

setup(
    name="mywebstyle",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "matplotlib",
        "seaborn"
    ],
    description="A package to custom design my website"
)

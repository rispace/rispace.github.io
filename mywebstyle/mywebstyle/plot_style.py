import matplotlib.pyplot as plt
import seaborn as sns


def plot_style(color='#f4f4f4'):
    """
    Set the background color for Matplotlib and Seaborn plots.

    Parameters:
    color (str): Hex color code for the background.
    """
    plt.rcParams['figure.facecolor'] = color
    plt.rcParams['axes.facecolor'] = color
    sns.set(rc={'figure.facecolor': color, 'axes.facecolor': color})

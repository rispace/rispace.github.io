import numpy as np


class NewLinearRegression:
    def __init__(self) -> None:
        self.beta = None

    def fit(self, X, y):
        X = np.concatenate([np.ones((len(X), 1)), X], axis=1)
        X_transpose_X = np.dot(X.transpose(), X)
        X_transpose_X_inverse = np.linalg.inv(X_transpose_X)
        X_transpose_y = np.dot(X.transpose(), y)
        self.beta = np.dot(X_transpose_X_inverse, X_transpose_y)

    def predict(self, X):
        X = np.concatenate([np.ones((len(X), 1)), X], axis=1)
        return np.dot(X, self.beta)

    def coeff_(self):
        return self.beta[1:].tolist()

    def interceptt_(self):
        return self.beta[0].tolist()


class GDLinearRegression:
    def __init__(self, learning_rate=0.01, number_of_iteration=1000) -> None:
        self.learning_rate = learning_rate
        self.number_of_iteration = number_of_iteration
        self.weights = None
        self.bias = None

    def fit(self, X, y):
        num_of_samples, num_of_features = X.shape
        self.weights = np.zeros(num_of_features)
        self.bias = 0

        for _ in range(self.number_of_iteration):
            y_predicted = np.dot(X, self.weights) + self.bias

            d_weights = (1 / num_of_samples) * np.dot(X.T, (y_predicted - y))
            d_bias = (1 / num_of_samples) * np.sum(y_predicted - y)

            self.weights -= self.learning_rate * d_weights
            self.bias -= self.learning_rate * d_bias

    def predict(self, X):
        y_predicted = np.dot(X, self.weights) + self.bias
        return y_predicted

    def coefff_(self):
        return self.weights.tolist()

    def intercepttt_(self):
        return self.bias


class SGDLinearRegression:
    def __init__(self, learning_rate=0.01, num_iterations=1000, batch_size=1) -> None:
        self.learning_rate = learning_rate
        self.num_iterations = num_iterations
        self.batch_size = batch_size
        self.theta = None
        self.mse_list = None  # Initialize mse_list as an instance attribute

    def _loss_function(self, X, y, beta):
        num_samples = len(y)
        y_predicted = X.dot(beta)
        mse = (1/num_samples) * np.sum(np.square(y_predicted - y))
        return mse

    def _gradient_function(self, X, y, beta):
        num_samples = len(y)
        y_predicted = X.dot(beta)
        grad = (1/num_samples) * X.T.dot(y_predicted - y)
        return grad

    def fit(self, X, y):
        # Adding the intercept term (bias) as a column of ones
        X = np.concatenate([np.ones((len(X), 1)), X], axis=1)
        num_features = X.shape[1]
        self.theta = np.zeros((num_features, 1))

        self.mse_list = np.zeros(self.num_iterations)  # Initialize mse_list

        for i in range(self.num_iterations):
            # Randomly select a batch of data points
            indices = np.random.choice(
                len(y), size=self.batch_size, replace=False)
            X_i = X[indices]
            y_i = y[indices].reshape(-1, 1)

            # Compute the gradient and update the weights
            gradient = self._gradient_function(X_i, y_i, self.theta)
            self.theta = self.theta - self.learning_rate * gradient

            # Calculate loss for the entire dataset (optional)
            self.mse_list[i] = self._loss_function(X, y, self.theta)

        return self.theta, self.mse_list

    def predict(self, X):
        # Adding the intercept term (bias) as a column of ones
        X = np.concatenate([np.ones((len(X), 1)), X], axis=1)
        return X.dot(self.theta)

    def coef_(self):
        # Return the coefficients (excluding the intercept term)
        return self.theta[1:].flatten().tolist()

    def intercept_(self):
        # Return the intercept term
        return self.theta[0].item()

    def mse_losses(self):
        # Return the mse_list
        return self.mse_list.tolist()

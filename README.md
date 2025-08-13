# Personal Academic Website Template Powered by Quarto

Welcome to the repository for my personal academic [website](https://mrislambd.github.io). This template is designed to help you create a professional and customizable academic website with ease.

## Features

- **Responsive Design**: Works on all devices, from mobile phones to desktops.
- **Easy Customization**: Modify the content and style to suit your needs.
- **Markdown Support**: Write your content in Markdown.
- **Static Site Generation**: Built using Quarto, ensuring fast load times and a simple deployment process.
- **SEO Friendly**: Optimized for search engines to improve discoverability.
- **Social Media Integration**: Easily link your social media profiles.
- **Blog Support**: Includes a blog section for sharing your thoughts and research.

## Getting Started

To get started with this template, follow these steps:

### Prerequisites

- [Git](https://git-scm.com/)
- [Quarto](https://quarto.org/)
- A GitHub account

### Installation

1. **Fork this repository**

   Click the "Fork" button at the top right corner of this page to create a copy of this repository under your GitHub account.

2. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/mrislambd.github.io.git
   cd <your-username>.github.io
   ```

3. **Install Quarto**

   Follow the instructions [here](https://quarto.org/docs/get-started/) to install Quarto on your machine.

### Customization

1. **Update Configuration**

   Edit the `_quarto.yml` file to update your site’s title, description, and other configurations.

2. **Add Your Content**

   - **Homepage**: Edit the `index.qmd` file with your personal information.
   - **Blog Posts**: Add new blog posts in the `blog` directory. Use the `.qmd` format for your posts.
   - **Assets**: Place your images and other assets in the `assets` directory.

3. **Customize Styles**

   If you want to customize the look and feel of your site, modify the CSS files in the `styles` directory.

### Building and Deploying

1. **Render the site using GitHub Actions**

   This template uses GitHub Actions for rendering. The rendering process is set up in the `.github/workflows/publish.yml` file.

2. **Deploy to GitHub Pages**

   Push your changes to the `main` branch:

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

   Your site will be automatically rendered and published to GitHub Pages. Ensure that the repository name is `<your-username>.github.io` to take advantage of GitHub Pages hosting.

## Contributing

If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.txt) file for more details.


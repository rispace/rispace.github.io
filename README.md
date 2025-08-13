[![GitHub stars](https://img.shields.io/github/stars/rispace/rispace.github.io?style=for-the-badge)](https://github.com/rispace/rispace.github.io/)
[![GitHub forks](https://img.shields.io/github/forks/rispace/rispace.github.io?style=for-the-badge)](https://github.com/rispace/rispace.github.io/network/members)
[![GitHub issues](https://img.shields.io/github/issues/rispace/rispace.github.io?style=for-the-badge)](https://github.com/rispace/rispace.github.io/issues)
[![Follow on GitHub](https://img.shields.io/github/followers/rispace?label=Follow&style=for-the-badge)](https://github.com/rispace)
[![Open in GitHub Codespaces](https://img.shields.io/badge/Codespaces-Open-blue?style=for-the-badge&logo=github)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=rispace%2Fholmc)



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
   git clone https://github.com/<your-username>/rispace.github.io.git
   cd <your-username>.github.io
   ```

3. **Create a new branch**

   ```bash
   git checkout -b gh-pages
   ```  
   
   Then from the settings of your repository, set the GitHub Pages source to the `gh-pages` branch.

4. **Install Quarto**

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


1. **Build the site locally**

   To preview your site locally, run the following command:

   ```bash
   quarto preview
   ```

   This will generate the static files in the `docs` directory.

2. **Render the site using GitHub Actions**

   This template uses GitHub Actions for rendering. The rendering process is set up in the `.github/workflows/publish.yml` file. You can modify this file to change the rendering settings if needed. For my case, it has both renv and python environments, so it will render both R and Python code chunks. But if you only use R or Python, you can remove the unnecessary parts. These environments are only required if you use R or Python code chunks in your website. If you only use markdown, you can remove the `renv` and `python` parts.

   ```bash
   on:
     workflow_dispatch:
     push:
       branches: main

   name: Quarto Publish

   jobs:
     build-deploy:
     runs-on: ubuntu-latest
     permissions:
      contents: write
     steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Quarto
        uses: quarto-dev/quarto-actions/setup@v2
      
      - name: Install TinyTeX
        run: |
          quarto install tinytex
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Install Python and Dependencies
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
          cache: 'pip'
      - run: pip install jupyter
      - run: pip install -r requirements.txt

      - name: Configure Kaggle API
        env:
          KAGGLE_USERNAME: ${{ secrets.KAGGLE_USERNAME }}
          KAGGLE_KEY: ${{ secrets.KAGGLE_KEY }}
        run: |
          mkdir -p ~/.kaggle
          echo "{\"username\":\"$KAGGLE_USERNAME\",\"key\":\"$KAGGLE_KEY\"}" > ~/.kaggle/kaggle.json
          chmod 600 ~/.kaggle/kaggle.json


      - name: Render and Publish
        uses: quarto-dev/quarto-actions/publish@v2
        with:
          target: gh-pages
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

3. **Deploy to GitHub Pages**

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


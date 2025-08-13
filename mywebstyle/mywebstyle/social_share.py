# my_package/social_share.py

def social_share(link):
    """
    Generate HTML for social media share buttons and embedded comments.

    Parameters:
    link (str): The URL to be shared.

    Returns:
    str: The formatted HTML string.
    """
    html = f"""
::::{{.columns}}
:::.{{.column width="33%"}}
<a href="https://www.facebook.com/sharer.php?u={link}" target="_blank" style="color:#1877F2; text-decoration: none;">
{{{{< fa brands facebook size=3x >}}}}
</a>
:::
:::.{{.column width="33%"}}
<a href="https://www.linkedin.com/sharing/share-offsite/?url={link}" target="_blank" style="color:#0077B5; text-decoration: none;">
{{{{< fa brands linkedin size=3x >}}}}
</a>
:::
:::.{{.column width="33%"}}
<a href="https://www.twitter.com/intent/tweet?url={link}" target="_blank" style="color:#1DA1F2; text-decoration: none;">
{{{{< fa brands twitter size=3x >}}}}
</a>
:::
::::

<script src="https://giscus.app/client.js"
        data-repo="mrislambd/mrislambd.github.io" 
        data-repo-id="R_kgDOMV8crA"
        data-category="Announcements"
        data-category-id="DIC_kwDOMV8crM4CjbQW"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="light"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>

<div id="fb-root"></div>
<script async defer crossorigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v20.0"></script>
<div class="fb-comments" data-href="{link}" data-width="750" data-numposts="5"></div>
"""
    return html

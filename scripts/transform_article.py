#!/usr/bin/env python3
"""Transform a research journal article for the consolidated general site.

Usage:
    python3 transform_article.py [input_dir] [output_dir]

Defaults:
    input_dir:  research/raw
    output_dir: research/posts

Workflow:
    1. Copy raw articles from jacobs-research-journal/posts/ into research/raw/
    2. Run this script
    3. Transformed articles appear in research/posts/ ready to commit
"""
import re, sys, os

NAVBAR = '''<nav class="navbar">
    <div class="container">
        <a href="../../about.html" class="logo">Jacob Brooke</a>
        <ul class="nav-links">
            <li><a href="../../about.html">About</a></li>
            <li><a href="../../now.html">Now</a></li>
            <li><a href="../../briefing/">Briefing</a></li>
            <li><a href="../" class="active">Research</a></li>
            <li><a href="../../reads.html">Reads</a></li>
            <li><a href="../../year_in_review_2025.html">2025 Running</a></li>
            <li><a href="../../clocks.html">Clocks</a></li>
            <li><a href="../../claude-models.html">Claude Guide</a></li>
        </ul>
    </div>
</nav>'''

FOOTER = '''<div class="footer" style="text-align:center;padding:20px;color:#636e72;font-size:0.9em">
    <p>Built with Claude &#x1F980; Wed 04&#x2022;16&#x2022;26</p>
</div>'''

def transform(html):
    # Replace site-header with navbar
    html = re.sub(
        r'<header class="site-header">.*?</header>',
        NAVBAR,
        html, flags=re.DOTALL
    )
    # Replace stylesheet
    html = html.replace(
        'href="../style.css"',
        'href="../../styles.css">\n  <link rel="stylesheet" href="../../styles-consolidated.css"'
    )
    # Replace byline
    html = html.replace('By Jacob Brooke', 'By Claude')
    # Replace article:author meta
    html = html.replace('content="Jacob Brooke"', 'content="Claude"')
    # Replace journal name everywhere
    html = html.replace("Jacob's Research Journal", "Research")
    # Replace CSS classes
    html = html.replace('class="post-body"', 'class="article-body"')
    html = html.replace('class="sources"', 'class="article-sources"')
    html = html.replace('class="callout"', 'class="article-callout"')
    html = html.replace('class="callout-label"', 'class="article-callout-label"')
    # Replace footer
    html = re.sub(
        r'<footer class="site-footer">.*?</footer>',
        FOOTER,
        html, flags=re.DOTALL
    )
    # Replace breadcrumb home link
    html = html.replace('../index.html', '../')
    # Remove favicon link
    html = re.sub(r'\s*<link rel="icon"[^>]*>\n?', '\n', html)
    return html

if __name__ == '__main__':
    input_dir = sys.argv[1] if len(sys.argv) > 1 else 'research/raw'
    output_dir = sys.argv[2] if len(sys.argv) > 2 else 'research/posts'
    os.makedirs(output_dir, exist_ok=True)
    count = 0
    for fname in sorted(os.listdir(input_dir)):
        if fname.endswith('.html') and fname != '_template.html':
            with open(os.path.join(input_dir, fname)) as f:
                raw = f.read()
            transformed = transform(raw)
            with open(os.path.join(output_dir, fname), 'w') as f:
                f.write(transformed)
            count += 1
            print(f'  Transformed: {fname} ({len(raw)} -> {len(transformed)} chars)')
    print(f'\nDone. {count} articles transformed to {output_dir}/')

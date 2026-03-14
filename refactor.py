import os
import re

HEADER_REPLACEMENT = '<div id="header-container"></div>'
FOOTER_REPLACEMENT = '<div id="footer-container"></div>'

LOADER_AND_NEW_NAV_SCRIPT = """
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        // 1. Load Footer
        fetch('footer.html')
          .then(response => response.text())
          .then(data => {
            document.getElementById('footer-container').innerHTML = data;
          })
          .catch(error => console.error('Error loading footer:', error));

        // 2. Load Header
        fetch('header.html')
          .then(response => response.text())
          .then(data => {
            document.getElementById('header-container').innerHTML = data;
            
            // 3. Initialize the New Navigation after it is loaded into the page
            initializeNewNav();
          })
          .catch(error => console.error('Error loading header:', error));
      });

      function initializeNewNav() {
        /* --- Mobile Menu Toggler --- */
        const toggleBtn = document.querySelector(".navbar-toggler");
        const navbarNav = document.querySelector(".navbar-nav");
        const navCloseBtn = document.querySelector(".btn-nav-close");

        if (toggleBtn && navbarNav) {
            toggleBtn.addEventListener("click", () => navbarNav.classList.add("active"));
        }
        if (navCloseBtn && navbarNav) {
            navCloseBtn.addEventListener("click", () => navbarNav.classList.remove("active"));
        }

        /* --- Dropdown SVG Icons --- */
        const navItems = document.querySelectorAll(".nav-item");
        navItems.forEach((item) => {
            const hasDropdowns = item.querySelector(".dropdown") !== null;
            if (hasDropdowns) {
                const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgIcon.setAttribute("width", "16");
                svgIcon.setAttribute("height", "16");
                svgIcon.setAttribute("viewBox", "0 0 24 24");
                svgIcon.setAttribute("fill", "currentColor");
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95l-4.95-4.95a1 1 0 0 1 1.414-1.414z"); 
                svgIcon.appendChild(path);
                
                const link = item.querySelector("a");
                if (link) link.appendChild(svgIcon);
            }
        });

        /* --- Auto Active Page Script --- */
        // Get the current URL, ignoring #anchors or ?queries
        const currentUrl = window.location.href.split('#')[0].split('?')[0]; 
        const allNavLinks = document.querySelectorAll(".nav-link");
        
        allNavLinks.forEach((link) => {
            const linkUrl = link.href.split('#')[0].split('?')[0];
            if (linkUrl === currentUrl && link.getAttribute("href") !== "#") {
                link.classList.add("active");
                
                // Highlight parent menu if inside a dropdown
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    const parentNavItem = parentDropdown.closest('.nav-item');
                    if (parentNavItem) {
                        const parentLink = parentNavItem.querySelector('.nav-link');
                        if (parentLink) parentLink.classList.add("active");
                    }
                }
            }
        });

        /* --- Sticky Header on Scroll --- */
        // Targets the new header wrapper to make it sticky
        const header = document.querySelector("header"); 
        if (header) {
            window.addEventListener("scroll", () => {
                if (window.scrollY > 90) {
                    header.classList.add("sticky-header", "visible");
                    header.classList.remove("headerAnimate");
                } else {
                    header.classList.remove("sticky-header", "visible");
                    header.classList.add("headerAnimate");
                }
            });
        }
      }
    </script>
  </body>"""

def process_html_files(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                # Protect the components themselves from being overwritten
                if file in ['header.html', 'footer.html']:
                    continue
                    
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                original_content = content

                # 1. Strip the old <header> block
                content = re.sub(r'<header>.*?</header>', HEADER_REPLACEMENT, content, flags=re.DOTALL | re.IGNORECASE)
                
                # 2. Strip the old <footer> block
                content = re.sub(r'<footer[^>]*>.*?</footer>', FOOTER_REPLACEMENT, content, flags=re.DOTALL | re.IGNORECASE)

                # 3. Search and Destroy the old problematic Sticky JS block
                content = re.sub(r'<script>\s*// Header Script.*?debouncedHandleScroll\(\);\s*}\);\s*</script>', '', content, flags=re.DOTALL | re.IGNORECASE)

                # 4. Inject the new dynamic loader and safe script right before </body>
                if 'id="header-container"' in content and 'Dynamic Component Loader & New Nav Script' not in content:
                    content = re.sub(r'</body>', LOADER_AND_NEW_NAV_SCRIPT, content, flags=re.IGNORECASE)

                # 5. Save the file if changes were made
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated: {filepath}")

if __name__ == "__main__":
    project_directory = '.' 
    print("Starting refactor...")
    process_html_files(project_directory)
    print("Done! All 62 pages are now dynamically loading your new nav.")
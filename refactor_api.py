
import os
import re

files_to_process = [
    r"frontend\src\pages\AddTransaction.jsx",
    r"frontend\src\pages\Analytics.jsx",
    r"frontend\src\pages\BankAccounts.jsx",
    r"frontend\src\pages\Dashboard.jsx",
    r"frontend\src\pages\EditTransaction.jsx",
    r"frontend\src\components\CreditCardTracker\CardDetailView.jsx",
    r"frontend\src\pages\Settings.jsx",
    r"frontend\src\pages\TransactionsList.jsx",
    r"frontend\src\pages\Onboarding.jsx",
    r"frontend\src\components\Onboarding\PersonalInfo.jsx",
    r"frontend\src\components\Dashboard\CreditCardsSummary.jsx",
    r"frontend\src\components\Dashboard\FinancialOverview.jsx",
    r"frontend\src\components\Dashboard\RecentTransactions.jsx"
]

base_dir = r"c:\Users\LDNA40022\Lokesh\Semippu"

def get_relative_import_path(file_path):
    # Calculate depth relative to src
    # file_path is absolute or relative to cwd.
    # Assuming standard structure frontend/src/...
    parts = file_path.replace("\\", "/").split("/")
    try:
        src_index = parts.index("src")
        depth = len(parts) - src_index - 2 # -2 because index is src, and we want to go out from file's dir
        if depth <= 0:
            return "./utils/constants"
        return "../" * depth + "utils/constants"
    except ValueError:
        return "../utils/constants" # Fallback

def process_file(file_rel_path):
    abs_path = os.path.join(base_dir, file_rel_path)
    print(f"Checking {abs_path}")
    if not os.path.exists(abs_path):
        print(f"Skipping {abs_path} - Not found")
        return

    with open(abs_path, 'r', encoding='utf-8') as f:
        content = f.read()
    original_content = content

    if "API_BASE_URL" in content and "import" in content:
        print(f"Skipping {file_rel_path} - Already has API_BASE_URL")
        # continue processing replace just in case valid URL remains? 
        # But safest to assume if API_BASE_URL is there, I might have half-done it. 
        # But for now let's assume if imported, it's done or I should careful.
        # Actually I should just do the replace.
        pass

    # 1. Determine import path
    import_path = get_relative_import_path(file_rel_path)
    import_statement = f"import {{ API_BASE_URL }} from '{import_path}';"

    # 2. Add import if not present
    if "API_BASE_URL" not in content:
        # Insert after last import or at top
        if "import " in content:
            last_import = content.rfind("import ")
            newline_index = content.find("\n", last_import)
            content = content[:newline_index+1] + import_statement + "\n" + content[newline_index+1:]
        else:
            content = import_statement + "\n" + content

    # 3. Replace URLs
    
    # CASE A: Already in backticks (template literals)
    # Match: `http://localhost:8000...`
    # Replace with: `${API_BASE_URL}...`
    # We just replace the start of the string inside the backtick.
    content = content.replace("`http://localhost:8000", "`${API_BASE_URL}")

    # CASE B: Single or Double Quotes
    # Match: 'http://localhost:8000...' or "http://localhost:8000..."
    # Replace with: `${API_BASE_URL}...` AND change quotes to backticks.
    
    def replace_quote_match(match):
        # match.group(2) is the rest of the url
        rest = match.group(2)
        return f"`${{API_BASE_URL}}{rest}`"

    # Regex: (['"])http://localhost:8000(.*?)\1
    # Note: This handles static strings.
    quote_pattern = re.compile(r"(['\"])(http://localhost:8000)(.*?)\1")
    content = quote_pattern.sub(replace_quote_match, content)
    
    if content != original_content:
        with open(abs_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_rel_path}")
    else:
        print(f"No changes in {file_rel_path}")

for fp in files_to_process:
    process_file(fp)

{
    "name": "Nursing Home Vistation",
    "summary": """Vistation management""",
    "category": "Uncategorized",
    "version": "13.0.0.1",
    "author": "Waite Perpectives, LLC - Zach Waite",
    "depends": [
        "website",
    ],
    "data": [
        "security/ir.model.access.csv",
        "views/assets.xml",
        "views/views.xml",
        "views/actions.xml",
        "views/menus.xml",
        "views/templates.xml",
    ],
    "demo": [],
    "qweb": ["static/src/xml/*"],
    "images": [],
    "post_load": None,
    "pre_init_hook": None,
    "post_init_hook": None,
    "uninstall_hook": None,
    "application": False,
    "auto_install": False,
    "installable": True,
    # 'external_dependencies': {'python': [], 'bin': []},
    # 'support': 'zach@waiteperspectives.com',
    # 'website': 'www.waiteperspectives.com',
    # 'license': 'LGPL-3',
    # 'price': 999.00,
    # 'currency': 'USD',
}
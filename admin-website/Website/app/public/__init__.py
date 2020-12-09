from flask import Blueprint

blueprint = Blueprint(
    'public_blueprint',
    __name__,
    url_prefix='/public',
    template_folder='templates',
    static_folder='static'
)

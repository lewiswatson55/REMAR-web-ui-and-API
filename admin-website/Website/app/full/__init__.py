from flask import Blueprint

blueprint = Blueprint(
    'full_blueprint',
    __name__,
    url_prefix='/full',
    template_folder='templates',
    static_folder='static'
)

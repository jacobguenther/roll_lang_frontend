# File: build.sh


# Copyright (C) 2020  Jacob Guenther
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

echo "Building roll lang frontend"
wasm-pack build --target no-modules --out-dir temp


mkdir --parents dist/static/assets
mkdir --parents dist/static/html
mkdir --parents dist/static/css
mkdir --parents dist/static/scripts
mkdir --parents dist/templates

cp temp/roll_lang_frontend* dist/static/scripts/

cp -r www/static/*    dist/static/
cp -r www/templates/* dist/templates/

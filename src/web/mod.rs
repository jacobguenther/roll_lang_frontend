// File src/web/mod.rs

// Copyright (C) 2020  Jacob Guenther
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// pub mod ids;

use roll_lang::macros::Macros;

use serde::Deserialize;
use wasm_bindgen::prelude::*;

static INIT_IDS: std::sync::Once = std::sync::Once::new();
static mut IDS: Option<ElementIds> = None;

pub fn init_ids(ids: &JsValue) {
	unsafe {
		INIT_IDS.call_once(|| {
			IDS = Some(ids.into_serde().unwrap());
		});
	}
}
pub fn ids() -> &'static mut ElementIds {
	unsafe { IDS.as_mut().unwrap() }
}

#[derive(Debug, Deserialize)]
pub struct ElementIds {
	pub main_header: String,
	pub main_nav_list: String,

	pub play_area: String,
	pub slider_bar: String,

	pub side_bar: String,

	pub tabs_header: String,
	pub header_item_history: String,
	pub header_item_character_sheets: String,
	pub header_item_macros: String,
	pub header_item_tables: String,

	pub tab_content_wrapper: String,
	pub tab_content_history: String,
	pub tab_content_character_sheets: String,
	pub tab_content_macros: String,
	pub tab_content_tables: String,

	pub history_controls: String,
	pub clear_history: String,
	pub macro_shortcuts: String,
	pub history_wrapper: String,
	pub history_list: String,
	pub history_break: String,
	pub roll_lang_form: String,
	pub roll_lang_input_container: String,
	pub roll_lang_input_label: String,
	pub roll_lang_input: String,
	pub roll_lang_submit: String,

	pub create_macro_container: String,
	pub create_macro_name_label: String,
	pub create_macro_name: String,
	pub create_macro_source_label: String,
	pub create_macro_source: String,
	pub create_macro_shortcut_container: String,
	pub create_macro_add_shortcut: String,
	pub create_macro_submits: String,
	pub create_macro_create_or_update: String,
	pub create_macro_test_macro: String,
	pub create_macro_test_output: String,

	pub macro_table_container: String,
	pub macro_table: String,
	pub macro_table_header_name: String,
	pub macro_table_header_shortcut: String,
	pub macro_table_header_delete: String,
}
impl ElementIds {
	pub fn macros(name: &str) -> String {
		name.replace(" ", "-")
	}

	pub fn macro_table_row(name: &str) -> String {
		format!("macro-table-row-{}", ElementIds::macros(name))
	}
	pub fn macro_table_shortcut_tongle(name: &str) -> String {
		format!("place-in-bar-{}", ElementIds::macros(name))
	}
	pub fn macro_table_row_delete(name: &str) -> String {
		format!("delete-{}", ElementIds::macros(name))
	}

	pub fn macro_shortcut(name: &str) -> String {
		format!("macro-shortcut-{}", ElementIds::macros(name))
	}
}

use wasm_bindgen::JsCast;
use web_sys::Document;
use web_sys::Element;
use web_sys::HtmlDocument;
use web_sys::HtmlInputElement;
use web_sys::HtmlTextAreaElement;
use web_sys::Window;

pub struct Elements {}
impl Elements {
	pub fn window() -> Window {
		web_sys::window().expect("web_sys::failed to get the window")
	}
	pub fn document() -> Document {
		Elements::window()
			.document()
			.expect("web_sys::failed to get the document")
	}
	pub fn html_document() -> HtmlDocument {
		Elements::document()
			.dyn_into::<HtmlDocument>()
			.expect("wasm_bindgen::failed to cast document to HtmlDocument")
	}

	pub fn get_element(id: &str) -> Element {
		Elements::document()
			.get_element_by_id(id)
			.unwrap_or_else(|| panic!("web_sys::failed to finde element with id \"{}\"", id))
	}
	pub fn create_element(element_type: &str) -> Element {
		Elements::document()
			.create_element(element_type)
			.unwrap_or_else(|_| {
				panic!("web_sys::Failed to create element of type {}", element_type)
			})
	}

	pub fn set_value_create_macro_name(name: &str) {
		Elements::get_element(&ids().create_macro_name)
			.dyn_ref::<HtmlInputElement>()
			.unwrap()
			.set_value(name);
	}
	pub fn set_value_create_macro_source(source: &str) {
		Elements::get_element(&ids().create_macro_source)
			.dyn_ref::<HtmlTextAreaElement>()
			.unwrap()
			.set_value(source);
	}
	pub fn set_value_create_macro_add_shortcut(has_shortcut: bool) {
		Elements::get_element(&ids().create_macro_add_shortcut)
			.dyn_ref::<HtmlInputElement>()
			.unwrap()
			.set_checked(has_shortcut);
	}

	pub fn get_value_create_macro_name() -> String {
		Elements::get_element(&ids().create_macro_name)
			.dyn_ref::<HtmlInputElement>()
			.unwrap()
			.value()
	}
	pub fn get_value_create_macro_source() -> String {
		Elements::get_element(&ids().create_macro_source)
			.dyn_ref::<HtmlTextAreaElement>()
			.unwrap()
			.value()
	}
	pub fn get_value_create_macro_add_shortcut() -> bool {
		Elements::get_element(&ids().create_macro_add_shortcut)
			.dyn_ref::<HtmlInputElement>()
			.unwrap()
			.checked()
	}

	pub fn macro_table() -> Element {
		Elements::get_element(&ids().macro_table)
	}
	pub fn macro_table_row(name: &str) -> Element {
		Elements::get_element(&ElementIds::macro_table_row(name))
	}
	pub fn macro_table_shortcut_tongle(name: &str) -> Element {
		Elements::get_element(&ElementIds::macro_table_shortcut_tongle(name))
	}
	pub fn macro_table_row_delete(name: &str) -> Element {
		Elements::get_element(&ElementIds::macro_table_row_delete(name))
	}

	pub fn get_value_table_row_shortcut_tongle(name: &str) -> bool {
		Elements::macro_table_shortcut_tongle(name)
			.dyn_ref::<HtmlInputElement>()
			.unwrap()
			.checked()
	}

	pub fn macro_shortcuts() -> Element {
		Elements::get_element(&ids().macro_shortcuts)
	}
	pub fn macro_shortcut(name: &str) -> Element {
		Elements::get_element(&ElementIds::macro_shortcut(name))
	}
}

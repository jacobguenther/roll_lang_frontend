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
use roll_lang::macros::MacroData;

use serde::{Serialize, Deserialize};
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
	unsafe {
		IDS.as_mut().unwrap()
	}
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

	pub macro_table_container: String,
	pub macro_table: String,
	pub macro_table_header_name: String,
	pub macro_table_header_shortcut: String,
	pub macro_table_header_delete: String,
}
impl ElementIds {
	pub fn macros(name: &str) -> String {
		name.replace(" ","-")
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
use web_sys::Window;
use web_sys::Document;
use web_sys::HtmlDocument;
use web_sys::Element;
use web_sys::HtmlInputElement;
use web_sys::HtmlTextAreaElement;

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
			.expect(&format!("web_sys::failed to finde element with id \"{}\"", id))
	}
	pub fn create_element(element_type: &str) -> Element {
		Elements::document()
			.create_element(element_type)
			.expect(&format!("web_sys::Failed to create element of type {}", element_type))
	}


	pub fn set_value_create_macro_name(name: &str) {
		Elements::get_element(&ids().create_macro_name)
			.dyn_ref::<HtmlInputElement>().unwrap()
			.set_value(name);
	}
	pub fn set_value_create_macro_source(source: &str) {
		Elements::get_element(&ids().create_macro_source)
			.dyn_ref::<HtmlTextAreaElement>().unwrap()
			.set_value(source);
	}
	pub fn set_value_create_macro_add_shortcut(has_shortcut: bool) {
		Elements::get_element(&ids().create_macro_add_shortcut)
			.dyn_ref::<HtmlInputElement>().unwrap()
			.set_checked(has_shortcut);
	}

	pub fn get_value_create_macro_name() -> String {
		Elements::get_element(&ids().create_macro_name)
			.dyn_ref::<HtmlInputElement>().unwrap()
			.value()
	}
	pub fn get_value_create_macro_source() -> String {
		Elements::get_element(&ids().create_macro_source)
			.dyn_ref::<HtmlTextAreaElement>().unwrap()
			.value()
	}
	pub fn get_value_create_macro_add_shortcut() -> bool {
		Elements::get_element(&ids().create_macro_add_shortcut)
			.dyn_ref::<HtmlInputElement>().unwrap()
			.checked()
	}

	pub fn macro_table() -> Element {
		Elements::get_element(&ids().macro_table)
	}
	pub fn macro_table_row(name: &str) -> Element {
		Elements::get_element(&ElementIds::macro_table_row(name))
	}
	pub fn macro_table_shortcut_tongle(name: &str) -> Element {
		Elements::get_element(
			&ElementIds::macro_table_shortcut_tongle(name))
	}
	pub fn macro_table_row_delete(name: &str) -> Element {
		Elements::get_element(
			&ElementIds::macro_table_row_delete(name))
	}

	pub fn get_value_table_row_shortcut_tongle(name: &str) -> bool {
		Elements::macro_table_shortcut_tongle(name)
			.dyn_ref::<HtmlInputElement>().unwrap()
			.checked()
	}

	pub fn macro_shortcuts() -> Element {
		Elements::get_element(&ids().macro_shortcuts)
	}
	pub fn macro_shortcut(name: &str) -> Element {
		Elements::get_element(&ElementIds::macro_shortcut(name))
	}
}
pub mod cookies {
	use crate::web::*;
	pub fn add_macro(name: &str, data: &MacroData) {
		let time = "Mon, 01 Jan 2024 00:00:00 GMT";
		let _result = Elements::html_document()
			.set_cookie(
				&format!("macro:{}={}:{}; SameSite=Strict; expires={};",
					name,
					in_bar_2_string(data.in_bar),
					data.source,
					time
				)
			);
	}
	pub fn remove_macro(name: &str) {
		let _result = Elements::html_document()
			.set_cookie(
				&format!("macro:{}=\"\"; SameSite=Strict; expires=Thur, 01 Jan 1970 00:00:00: UTC; path=/;",
					name
				)
			);
	}
	pub fn in_bar_2_string(in_bar: bool) -> String {
		match in_bar {
			true => "InBar",
			false => "OutOfBar",
		}.to_owned()
	}
	pub fn string_2_in_bar(text: &str) -> Option<bool> {
		match text {
			"InBar" => Some(true),
			"OutOfBar" => Some(false),
			_ => None,
		}
	}
}

pub fn macros_from_cookies() -> Macros {
	let mut macros = Macros::new();

	let raw_cookies = Elements::html_document().cookie().unwrap();
	for cookie in raw_cookies.split(";") {
		let mut key_value = cookie.split("=");
		let (key, value) = match key_value.next() {
			Some(key) => match key_value.next() {
				Some(value) => (key, value),
				_ => continue,
			},
			_ => continue,
		};

		let mut cookie_types = key.split(":");
		let name = match cookie_types.next() {
			Some("macro") | Some(" macro") => match cookie_types.next() {
				Some(name) => name.to_string(),
				_ => continue,
			},
			_ => continue,
		};

		let mut data = value.split(":");
		let macro_data = match data.next() {
			Some(bar_str) => match cookies::string_2_in_bar(bar_str) {
				Some(bar_bool) => match data.next() {
					Some(source) => MacroData::new(bar_bool, source),
					None => continue,
				},
				None => continue,
			},
			None => continue,
		};

		macros.insert(name.to_string(), macro_data);
	}

	macros
}

pub fn add_macro_to_bar(name: &str) {
	let button = Elements::create_element("button");
	let _result = button.set_attribute("id", &ElementIds::macro_shortcut(name));
	let _result = button.set_attribute(
		"onclick",
		&format!("runMacro(\"{}\");", name)
	);
	button.set_inner_html(name);
	let _result = Elements::macro_shortcuts().append_child(&button);
}
pub fn add_macro_to_table(name: &str, in_bar: bool) {
	let row = Elements::create_element("tr");
	let _result = row.set_attribute("id", &ElementIds::macro_table_row(name));

	let name_cell = Elements::create_element("td");
	name_cell.set_inner_html(name);
	let _result = name_cell.set_attribute(
		"onclick",
		&format!("wasm_bindgen.handle_macro_select(\"{}\");", name)
	);

	let place_in_bar_cell = Elements::create_element("td");
	let place_in_bar = Elements::create_element("input");
	let _result = place_in_bar.set_attribute("id", &ElementIds::macro_table_shortcut_tongle(name));
	let _result = place_in_bar.set_attribute(
		"onchange",
		&format!("wasm_bindgen.handle_macro_change_in_bar(\"{}\");", name)
	);
	let _result = place_in_bar.set_attribute("type", "checkbox");
	if in_bar {
		let _result = place_in_bar.set_attribute("checked", "");
	}
	let _result = place_in_bar_cell.append_child(&place_in_bar);


	let delete_cell = Elements::create_element("td");
	delete_cell.set_inner_html("delete");
	let _result = delete_cell.set_attribute("id", &ElementIds::macro_table_row_delete(name));
	let _result = delete_cell.set_attribute(
		"onclick",
		&format!("wasm_bindgen.handle_macro_delete(\"{}\");", name)
	);

	let _result = row.append_child(&name_cell);
	let _result = row.append_child(&place_in_bar_cell);
	let _result = row.append_child(&delete_cell);

	let table = Elements::macro_table();
	let _result = table.append_child(&row);
}
// fn update_macro_table_row(name: &str, in_bar: bool) {
// 	Web::document()
// 		.get_element_by_id(&ID::row_check_box(name)).unwrap()
// 		.dyn_ref::<HtmlInputElement>().unwrap()
// 		.set_checked(in_bar);
// }

// fn macro_cookie(name: &str) -> Option<MacroData> {
// 	let raw_cookies = Web::html_document().cookie().unwrap();
// 	for cookie in raw_cookies.split(";") {
// 		let mut key_value = cookie.split("=");
// 		let (key, source) = match key_value.next() {
// 			Some(key) => match key_value.next() {
// 				Some(value) => (key, value),
// 				_ => continue,
// 			},
// 			_ => continue,
// 		};

// 		let mut cookie_types = key.split(":");
// 		match cookie_types.next() {
// 			Some("macro") | Some(" macro") => match cookie_types.next() {
// 				Some("InBar") => match cookie_types.next() {
// 					Some(c_name) => if c_name == name {
// 						return Some(MacroData::new(true, source));
// 					},
// 					_ => continue,
// 				},
// 				Some("OutOfBar") => match cookie_types.next() {
// 					Some(c_name) => if c_name == name {
// 						return Some(MacroData::new(false, source));
// 					},
// 					_ => continue,
// 				},
// 				_ => continue,
// 			},
// 			_ => continue,
// 		};
// 	}

// 	None
// }
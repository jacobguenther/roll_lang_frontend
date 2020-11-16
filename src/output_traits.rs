// File: src/output_traits.rs

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

use roll_lang::interpreter::output::*;

pub trait AsHtml {
	fn as_html(&self) -> String;
}

impl AsHtml for Output {
	fn as_html(&self) -> String {
		let mut out = String::new();
		for fragment in &self.fragments {
			out = format!("{}{}", out, fragment.as_html());
		}
		match &self.error {
			Some(e) => out = format!("{} Error::{:?}", out, e.clone()),
			None => (),
		}
		out
	}
}

impl AsHtml for OutputFragment {
	fn as_html(&self) -> String {
		match self {
			OutputFragment::StringLit(s) => s.clone(),
			OutputFragment::Roll(roll_type) => roll_type.as_html(),
		}
	}
}
impl AsHtml for RollType {
	fn as_html(&self) -> String {
		match self {
			RollType::ExplicitRoll(expression_output) => format!(
				"<div class=\"roll\">\
						{}\
					</div>",
				expression_output.as_html()
			),
			RollType::InlineRoll(expression_output) => format!(
				"<div class=\"inline_roll\">\
						<div class=\"result\">{}</div>\
						<div class=\"tooltip_text\">{}</div>\
					</div>",
				expression_output.result,
				expression_output.as_html()
			),
		}
	}
}
impl AsHtml for ExpressionOutput {
	fn as_html(&self) -> String {
		format!(
			"<div class=\"formula\">{}</div>=\
			<div class=\"result\">{}</div>",
			self.formula_fragments.as_html(),
			self.result
		)
	}
}
impl AsHtml for FormulaFragments {
	fn as_html(&self) -> String {
		let mut html = String::new();
		for fragment in self {
			html = format!("{}{}", html, fragment.as_html());
		}
		html
	}
}
impl AsHtml for FormulaFragment {
	fn as_html(&self) -> String {
		let mut html = String::new();
		match self {
			FormulaFragment::Basic(string) => html.push_str(&string),
			FormulaFragment::NumberRolls(first_roll, rolls, tooltip) => {
				match tooltip {
					Some(_) => html.push_str("<div><div class=\"tooltipped\">("),
					None => html.push_str("<div>("),
				}

				html.push_str(&first_roll.as_html());
				html.push_str(&rolls.as_html());

				match tooltip {
					Some(comment) => html.push_str(&format!(
						")<div class=\"tooltiptext\">{}</div></div></div>",
						comment
					)),
					None => html.push_str(")</div>"),
				}
			}
			FormulaFragment::SuccessFailRolls(first_roll, rolls, tooltip) => {
				match tooltip {
					Some(_) => html.push_str("<div><div class=\"tooltipped\">"),
					None => html.push_str("<div>("),
				}

				html.push_str(&first_roll.as_html());
				html.push_str(&rolls.as_html());

				match tooltip {
					Some(comment) => html.push_str(&format!(
						")<div class=\"tooltiptext\">{}</div></div></div>",
						comment
					)),
					None => html.push_str(")</div>"),
				}
			}
		}
		html
	}
}
impl AsHtml for NumberRolls {
	fn as_html(&self) -> String {
		let mut html = String::new();
		for roll_value in self {
			html.push_str("+");
			html.push_str(&roll_value.as_html());
		}
		html
	}
}
impl AsHtml for NumberRoll {
	fn as_html(&self) -> String {
		match self {
			NumberRoll::Counted(int) => {
				format!("<div class=\"roll_counted\">{}</div>", int.value())
			}
			NumberRoll::NotCounted(int) => {
				format!("<div class=\"roll_not_counted\">{}</div>", int.value())
			}
		}
	}
}

impl AsHtml for SuccessFailRolls {
	fn as_html(&self) -> String {
		let mut html = String::new();
		for roll_value in self {
			html.push_str(",");
			html.push_str(&roll_value.as_html());
		}
		html
	}
}
impl AsHtml for SuccessFail {
	fn as_html(&self) -> String {
		let (class, value) = match self {
			SuccessFail::Success(roll) => ("success_roll", roll.value()),
			SuccessFail::Fail(roll) => ("fail_roll", roll.value()),
			SuccessFail::CriticalSuccess(roll) => ("critical_success_roll", roll.value()),
			SuccessFail::CriticalFail(roll) => ("critical_fail_roll", roll.value()),
		};
		format!("<div class=\"{}\">{}</div>", class, value)
	}
}

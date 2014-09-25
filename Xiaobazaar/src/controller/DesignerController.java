package controller;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.*;

import model.Designer;
import model.Theme;
import manager.DesignerManager;
import manager.ThemeManager;

public class DesignerController {

	public JSONObject createDesigner(JSONObject inputJson) {
		JSONObject returnJson = new JSONObject();

		try {
			String name = (String) inputJson.get("name");
			String password = (String) inputJson.get("password");

			Designer designer = new Designer(name, password);

			DesignerManager.addDesigner(designer);

			returnJson.put("status", 1);
			returnJson.put("message", designer.getName());
		} catch (Exception e) {
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
		}

		return returnJson;
	}

	public static JSONObject designerAuth(JSONObject inputJson) {
		JSONObject returnJson = new JSONObject();
		ArrayList<Designer> tem = new ArrayList<Designer>();

		try {
			String name = (String) inputJson.get("username");
			String password = (String) inputJson.get("password");

			Designer designer = null;

			tem = DesignerManager.getAllDesigners();

			for (Designer d : tem) {
				if (d.getName().equals(name)) {
					designer = d;
				}
			}

			if (designer == null) {
				returnJson.put("status", 0);
				returnJson.put("message", "username does not exist");
			} else {
				if (designer.getPassword().equals(password)) {
					returnJson.put("status", 1);
					returnJson.put("message", designer.getName());
				} else {
					returnJson.put("status", 0);
					returnJson.put("message", "password error");
				}

			}
		} catch (Exception e) {
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
		}

		return returnJson;
	}

	public JSONObject updateDesigner(JSONObject inputJson) {
		JSONObject returnJson = new JSONObject();

		try {
			Designer designer = DesignerManager
					.getDesignerById((long) inputJson.get("designerId"));
			String password = (String) inputJson.get("password");

			designer.setPassword(password);

			DesignerManager.modifyDesigner(designer);

			returnJson.put("status", 1);
			returnJson.put("message", "success");
		} catch (Exception e) {
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
		}

		return returnJson;
	}

	public static JSONObject changeThemeStatus(JSONObject inputJSON) {
		JSONObject returnJson = new JSONObject();
		try {
			Long themeID = (Long) inputJSON.get("themeID");
			Long newStatus = (Long) inputJSON.get("status");
			Theme t = ThemeManager.getThemeById(themeID);
			t.setThemeStatus(newStatus);
			ThemeManager.modifyTheme(t);
			returnJson.put("result", 1);
			returnJson.put("message", "Updated!");
		} catch (Exception e) {
			returnJson.put("result", 0);
			returnJson.put("message", e.toString());
		}

		return returnJson;
	}

	public static JSONObject saveTheme(JSONObject inputJSON) {

		JSONObject returnJson = new JSONObject();
		try {
			Long themeID = (Long) inputJSON.get("themeID");
			String newThemeName = (String) inputJSON.get("newThemeName");

			List<Theme> themelist = ThemeManager.getAllTheme();

			boolean isDuplicated = false;

			for (Theme t : themelist) {
				if (t.getName().equalsIgnoreCase(newThemeName)
						&& t.getThemeId() != themeID) {
					isDuplicated = true;
				}
			}

			if (isDuplicated == false) {

				String newURL = (String) inputJSON.get("newURL");
				Theme modifiedTheme = ThemeManager.getThemeById(themeID);
				// set new name
				String oldURL = modifiedTheme.getThemeURL();

				boolean isURLModified = false;
				if (!oldURL.equals(newURL)) {
					modifiedTheme.setThemeStatus(0);
					isURLModified = true;
				}
				modifiedTheme.setName(newThemeName);
				modifiedTheme.setThemeURL(newURL);
				// update database

				ThemeManager.modifyTheme(modifiedTheme);
				returnJson.put("status", 1);
				returnJson.put("message", "Updated!");
				if (isURLModified == true) {
					returnJson.put("urlMod", 1);
				}

			} else {
				returnJson.put("status", 0);
				returnJson.put("message", "The theme name exists!");
				returnJson.put("urlMod", 0);

			}
		} catch (Exception e) {
			returnJson.put("status", 0);
			returnJson.put("message", "The theme name exists!");
			returnJson.put("urlMod", 0);
		}

		return returnJson;
	}
}

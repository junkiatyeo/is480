package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import model.Theme;
import manager.ThemeManager;

import javax.servlet.http.HttpServlet;

public class SaveThemeServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 4845978346119949793L;

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		process(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		process(request, response);
	}

	public void process(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		JSONObject returnJson = new JSONObject();
		String inputString = request.getParameter("json");
		JSONObject inputJSON = (JSONObject) JSONValue.parse(inputString);

		Long themeID = (Long) inputJSON.get("themeID");
		String newThemeName = (String) inputJSON.get("newThemeName");
		
		List<Theme> themelist = ThemeManager.getAllTheme();
		
		boolean isDuplicated = false;
		
		for (Theme t : themelist) {
			if (t.getName().equalsIgnoreCase(newThemeName) && t.getThemeId() != themeID) {
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

			try {
				ThemeManager.modifyTheme(modifiedTheme);
				returnJson.put("status", 1);
				returnJson.put("message", "Updated!");
				if(isURLModified == true) {
					returnJson.put("urlMod", 1);
				}
			} catch (Exception e) {
				returnJson.put("status", 0);
				returnJson.put("message", "Fail!");
				returnJson.put("urlMod", 0);
			}
		} else {
			returnJson.put("status", 0);
			returnJson.put("message", "The theme name exists!");
			returnJson.put("urlMod", 0);
			
		}
		//System.out.println(returnJson.toString());
		PrintWriter out = response.getWriter();
		out.print(returnJson.toString());
	}
}
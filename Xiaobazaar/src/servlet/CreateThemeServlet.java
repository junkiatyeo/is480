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

import model.Designer;
import model.Theme;
import manager.DesignerManager;
import manager.ThemeManager;

import javax.servlet.http.HttpServlet;

public class CreateThemeServlet extends HttpServlet {
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

		String newThemeName = (String) inputJSON.get("newThemeName");
		String newThemeCategory = (String) inputJSON.get("newThemeCategory");
		String newPrice = (String) inputJSON.get("newPrice");
		String themeURL = (String) inputJSON.get("themeURL");
		String designerName = (String) inputJSON.get("designerName");

		List<Theme> themelist = ThemeManager.getAllTheme();
		
		//System.out.println(themeURL);
		
		if (!themeURL.isEmpty() || !themeURL.equalsIgnoreCase("")) {
			boolean isDuplicated = false;
			for (Theme t : themelist) {
				if (t.getName().equalsIgnoreCase(newThemeName)) {
					isDuplicated = true;
				}
			}
			// set new name

			// update database
			if (isDuplicated == false) {
				try {
					Theme newTheme = new Theme(newThemeName,newThemeCategory,newPrice,
							DesignerManager.getDesignerByName(designerName),
							themeURL, 0);
					ThemeManager.addTheme(newTheme);
					returnJson.put("status", 1);
					returnJson.put("message", "Congratulations! The theme is created!");
				} catch (Exception e) {
					returnJson.put("status", 0);
					returnJson.put("message", "Fail!");
				}
			} else {
				returnJson.put("status", 0);
				returnJson.put("message", "The theme name has existed!");
			}
		} else {
			returnJson.put("status", 0);
			returnJson.put("message", "Please upload your css file!");
		}
		//System.out.println(returnJson.toString());
		PrintWriter out = response.getWriter();
		out.print(returnJson.toString());
	}
}
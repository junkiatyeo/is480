package servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import model.Theme;
import manager.ThemeManager;

import javax.servlet.http.HttpServlet;
public class ChangeThemeStatusServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = -4204427774567013151L;

	/**
	 * 
	 */

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		process(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		process(request, response);
	}
	
	public void process(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		JSONObject returnJson = new JSONObject();
		String inputString = request.getParameter("json");
		JSONObject inputJSON = (JSONObject)JSONValue.parse(inputString);
		
		Long themeID = (Long)inputJSON.get("themeID");
		Long newStatus = (Long)inputJSON.get("status");
		
		Theme t = ThemeManager.getThemeById(themeID);
		t.setThemeStatus(newStatus);
		try{
			ThemeManager.modifyTheme(t);
			returnJson.put("result", 1);
			returnJson.put("message", "Updated!");
		} catch (Exception e) {
			returnJson.put("result", 0);
			returnJson.put("message", "Fail!");
		}
		//update database

		//System.out.println(returnJson.toString());
		PrintWriter out = response.getWriter();
		out.print(returnJson.toString());
	}
	    
}
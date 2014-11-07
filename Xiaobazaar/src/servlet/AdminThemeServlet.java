package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import model.Theme;
import manager.ThemeManager;

import javax.servlet.http.HttpServlet;
public class AdminThemeServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = -5396673976900277474L;

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
		
		response.setContentType("application/json");		
		List<Theme> a = ThemeManager.getAllTheme();
		JSONObject returnJson = new JSONObject();
		JSONArray returnArray = new JSONArray();
		
		for(Theme t: a) {
			JSONObject o = new JSONObject();
			o.put("ThemeID", Long.toString(t.getThemeId()));
			o.put("Name",t.getName());
			o.put("Category", t.getCategory());
			o.put("Price", t.getPrice());
			o.put("Designer",t.getDesigner().getName());
			o.put("URL",t.getThemeURL());
			o.put("Status",Long.toString(t.isThemeStatus()));
			returnArray.add(o); 
		}
		returnJson.put("aaData",returnArray);
		PrintWriter out = response.getWriter();
		out.print(returnJson.toString());
	}
	    
}
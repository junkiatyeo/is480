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

import controller.DesignerController;
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
		try {
			String inputString = request.getParameter("json");
			JSONObject inputJSON = (JSONObject) JSONValue.parse(inputString);

			returnJson = DesignerController.saveTheme(inputJSON);
		} catch (Exception e) {
			returnJson.put("status",0);
			returnJson.put("message",e.toString());
		}
		// System.out.println(returnJson.toString());
		PrintWriter out = response.getWriter();
		out.print(returnJson.toString());
	}
}
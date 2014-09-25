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

public class DesignerLoginServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

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
		JSONObject inputJSON = (JSONObject)JSONValue.parse(inputString);
		String username = (String) inputJSON.get("username");
		String password = (String) inputJSON.get("password");
		
		try {
			Designer designer = DesignerManager.getDesignerByName(username);
			
			if(designer != null){
				String thisPassword = designer.getPassword();
				if(thisPassword.equals(password)){
					returnJson.put("status",1);
					returnJson.put("message",username);
				} else {
					returnJson.put("status",0);
					returnJson.put("message", "Invalid Password!");
				}
			}else{
				returnJson.put("status",0);
				returnJson.put("message", "No existing user!");
			}
		} catch (Exception e) {
			returnJson.put("status",0);
			returnJson.put("message", e.toString());
		}
		
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(returnJson.toString());
	}

}

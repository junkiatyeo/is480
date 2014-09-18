package servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import model.Designer;
import manager.AdminManager;
import manager.DesignerManager;

import javax.servlet.http.HttpServlet;
public class ChangeDesignerPassword extends HttpServlet {


	/**
	 * 
	 */
	private static final long serialVersionUID = 1659173802229967909L;

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

		JSONObject returnJson = new JSONObject();
		String inputString = request.getParameter("json");
		JSONObject inputJSON = (JSONObject)JSONValue.parse(inputString);
		String username = (String) inputJSON.get("username");
		String oldPassword = (String) inputJSON.get("oldPassword");
		String newPassword = (String) inputJSON.get("newPassword");
		String confirmPassword = (String) inputJSON.get("confirmPassword");
		
		Designer d = DesignerManager.getDesignerByName(username);
		
		if(d.getPassword().equals(oldPassword) && newPassword.equals(confirmPassword)  ){
			d.setPassword(newPassword);
			DesignerManager.modifyDesigner(d);
			returnJson.put("status", 1);
			returnJson.put("message", "Sucessfully Changed!");
		} else if (d.getPassword().equals(oldPassword) && !newPassword.equals(confirmPassword) ) {
			returnJson.put("status", 0);
			returnJson.put("message", "Please make sure confirm password is same as new password!");
		} else {
			returnJson.put("status", 0);
			returnJson.put("message", "Incorrect Password!");
		}
		
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(returnJson.toString());;
	}
	    
}
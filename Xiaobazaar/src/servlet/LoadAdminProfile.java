package servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import manager.AdminManager;
import model.Admin;

import javax.servlet.http.HttpServlet;

public class LoadAdminProfile extends HttpServlet {


	/**
	 * 
	 */
	private static final long serialVersionUID = 3838641927110247587L;

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
		//System.out.println(inputString);
		JSONObject inputJSON = (JSONObject)JSONValue.parse(inputString);
		String username = (String) inputJSON.get("username");

		Admin a = AdminManager.getAdminByName(username);
		try {
			returnJson.put("adminID",a.getAdminId());
			returnJson.put("adminName",a.getName());
			returnJson.put("status",1);
		} catch (NullPointerException ne) {
			returnJson.put("status",0);

		}
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(returnJson.toString());
	}

}

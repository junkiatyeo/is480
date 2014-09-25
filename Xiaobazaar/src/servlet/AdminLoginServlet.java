package servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.json.simple.parser.JSONParser;

import controller.AdminController;
import controller.OwnerController;
import manager.AdminManager;
import model.Admin;

import javax.servlet.http.HttpServlet;

public class AdminLoginServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 7539608222558378285L;

	/**
	 * 
	 */

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
		JSONParser parser = new JSONParser();

		try {
			String inputString = request.getParameter("json");
			JSONObject inputJson = (JSONObject) parser.parse(inputString);
			//System.out.println("Input: " + inputJson.toJSONString());

			returnJson = AdminController.adminAuth(inputJson);
		} catch (Exception e) {
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
			e.printStackTrace();
		}

		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(returnJson.toString());
	}

}

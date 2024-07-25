package kcg.system.main.ctl;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Scanner;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/system/naverNews")
public class NaverNewsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String clientId = "Qa1awDTL2x21DSZO3XXH"; // 네이버 API 클라이언트 ID
		String clientSecret = "wK9MxpJiKj"; // 네이버 API 클라이언트 시크릿

		try {
			String query = request.getParameter("query");
			String encodedQuery = URLEncoder.encode(query, "UTF-8");
			String apiUrl = "https://openapi.naver.com/v1/search/news.json?query=" + encodedQuery+"&display=15";

			URL url = new URL(apiUrl);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("X-Naver-Client-Id", clientId);
			con.setRequestProperty("X-Naver-Client-Secret", clientSecret);

			int responseCode = con.getResponseCode();

			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");

			// CORS 설정
			response.setHeader("Access-Control-Allow-Origin", "*");
			response.setHeader("Access-Control-Allow-Methods", "GET");
			response.setHeader("Access-Control-Allow-Headers", "Content-Type");
			response.setHeader("Access-Control-Max-Age", "3600");

			PrintWriter out = response.getWriter();

			if (responseCode == HttpURLConnection.HTTP_OK) {
				Scanner scanner = new Scanner(con.getInputStream(), "UTF-8");
				StringBuilder responseBody = new StringBuilder();
				while (scanner.hasNextLine()) {
					responseBody.append(scanner.nextLine());
				}
				scanner.close();
				out.println(responseBody.toString());
			} else {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				out.println("{\"error\": \"Failed to fetch data from Naver News API. Response code: " + responseCode
						+ "\"}");
			}
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			PrintWriter out = response.getWriter();
			out.println("{\"error\": \"" + e.getMessage() + "\"}");
			e.printStackTrace(); // 서버 로그에 스택 트레이스 출력
		}
	}
}
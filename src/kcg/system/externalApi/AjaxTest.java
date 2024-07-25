package kcg.system.externalApi;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import common.externalApi.GpsTransfer;
import common.externalApi.HnpWeather;
import common.utils.common.CmmnMap;
import kcg.common.svc.CommonSvc;
import kcg.system.main.svc.SystemMainSvc;

@RequestMapping("/ajax")
@Controller
public class AjaxTest {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	SystemMainSvc systemMainSvc;

	@Autowired
	CommonSvc commonSvc;

	@Autowired
	HnpWeather hnpWeather;

	@GetMapping(value = "/getWeatherInfo")
	@ResponseBody
	public String ajaxGetWeatherInfo(HttpServletRequest request) {

		log.info("::: ajaxGetWeatherInfo called :::");

		ModelMap model = new ModelMap();
		CmmnMap params = new CmmnMap();

		CmmnMap responseData;

		double latitude = Double.parseDouble(request.getParameter("latitude"));
		double longitude = Double.parseDouble(request.getParameter("longitude"));
		log.info("현재 위도는 : " + latitude);
		log.info("현재 경도는 : " + longitude);


		GpsTransfer gpsTransfer = new GpsTransfer(latitude, longitude);
        gpsTransfer.transfer(gpsTransfer, 0);

        int x = (int) Math.round(gpsTransfer.getxLat());
        int y = (int) Math.round(gpsTransfer.getyLon());

		log.info("변환된 X 좌표: " + x);
        log.info("변환된 Y 좌표: " + y);


		String[] v = new String[5];
		v = hnpWeather.get(x, y, v); // TODO 현재 위치를 받아와야함

		/*
		model.addAttribute("date", v[0]);
		model.addAttribute("time", v[1]);
		model.addAttribute("weather", v[2]);
		model.addAttribute("Temperatures", v[3]);
		model.addAttribute("humidity", v[4]);
		*/

		params.put("date", v[0]);
		params.put("time", v[1]);
		params.put("weather", v[2]);
		params.put("Temperatures", v[3]);
		params.put("humidity", v[4]);

		responseData = params;

		log.info("v[0] " + v[0]);
		log.info("v[1] " + v[1]);
		log.info("v[2] " + v[2]);
		log.info("v[3] " + v[3]);
		log.info("v[4] " + v[4]);
		log.info("params " + params);

		return "{\"message\": \"" + responseData + "\"}";
	}
}

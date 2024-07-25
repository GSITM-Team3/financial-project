package kcg.team3.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import common.utils.common.CmmnMap;
import kcg.team3.service.ProdThService;

@RequestMapping("/prod_th")
@Controller
public class ProdThController {

    @Autowired
    ProdThService prodThService;

 // 상품 목록 조회(페이징)240719
    @GetMapping("/prodList_th")
    public String prodListTh(HttpServletRequest request, Model model) {
        // 페이지 번호 파라미터 가져오기
        String pageParam = request.getParameter("page");
        int pageNum = pageParam != null ? Integer.parseInt(pageParam) : 1;
        
        int pageSize = 10;
        int offset = (pageNum - 1) * pageSize;

        CmmnMap params = new CmmnMap();
        params.put("pageSize", pageSize);
        params.put("offset", offset);
        
        // 요청 파라미터 가져오기
        String prodName = request.getParameter("productName");
        String paymentCycleParam = request.getParameter("paymentCycle");
        String subscriptionTypeParam = request.getParameter("subscriptionType");
        String salesStateParam = request.getParameter("salesState");

        // 각 파라미터 값을 변환
        String prod_name = (prodName != null && !prodName.isEmpty()) ? prodName : null;
        String prod_pay_cy = (paymentCycleParam != null && !paymentCycleParam.isEmpty()) ? paymentCycleParam : null;
        String prod_subscrip_type = (subscriptionTypeParam != null && !subscriptionTypeParam.isEmpty()) ? subscriptionTypeParam : null;
        String prod_sales_state = (salesStateParam != null && !salesStateParam.isEmpty()) ? salesStateParam : null;
        

        // 파라미터를 params에 추가
        params.put("prod_name", prod_name);
        params.put("prod_pay_cy", prod_pay_cy);
        params.put("prod_subscrip_type", prod_subscrip_type);
        params.put("prod_sales_state", prod_sales_state);
        
        // 필터링 여부 결정: 하나라도 존재하면 필터링 적용
        boolean isFiltering = (prod_name != null || prod_pay_cy != null || prod_subscrip_type != null || prod_sales_state != null);

        // 서비스 호출
        List<CmmnMap> prodList;
        int totalProds;

        if (isFiltering) { // 하나라도 존재하면 필터링
            prodList = prodThService.getProdListWithFilterAndPaging(params);
            totalProds = prodThService.getFilteredProdCount(params);
        } else {
            prodList = prodThService.getProdListWithPaging(params);
            totalProds = prodThService.getTotalProdCount();
        }
        
        int totalPages = (int) Math.ceil((double) totalProds / pageSize);
        
        model.addAttribute("prodList", prodList);
        model.addAttribute("currentPage", pageNum);
        model.addAttribute("totalPages", totalPages);

        return "/kcg/team3/ProdList_th";
    }
    
    // 상품 등록
    @GetMapping("/prodRegister_th")
    public String prodRegister_th() {
        return "/kcg/team3/ProdRegister_th";
    }

    @PostMapping("/getList")
    public List<CmmnMap> getList(CmmnMap params) {
        return prodThService.getList(params);
    }

    // 상품 저장
    @RequestMapping("/save")
	public CmmnMap save(CmmnMap params) {
		return prodThService.save(params);
	}

    @RequestMapping("/getInfo")
    public CmmnMap getInfo(CmmnMap params) {
        return prodThService.getInfo(params);
    }
}
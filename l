 $.ajax({
      url: "http://localhost:8080/BiteBudddy/OrderHistoryServlet",
      method: "GET",
      success: function (res) {
        if (res.length === 0) {
          $("#ordersContainer").html(`<p class="text-center text-gray-400">No orders found.</p>`);
          return;
        }

        let html = "";
        res.forEach(order => {
          const items = order.items.map(i => `
            <li class="flex justify-between text-sm">
              <span>${i.itemName}</span>
              <span>x${i.quantity}</span>
            </li>
          `).join("");

          html += `
            <div class="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 hover:scale-[1.02] transition-transform">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-semibold text-orange-400">#${order.orderId}</p>
                  <p>${order.restaurantName}</p>
                  <p class="text-sm text-gray-400">${order.orderDate}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-orange-300">₹${order.totalAmount.toFixed(2)}</p>
                  <p class="text-sm mt-1 ${statusColor(order.status)}">${order.status}</p>
                </div>
              </div>

              <ul class="mt-3 border-t border-gray-700 pt-3">${items}</ul>

              <div class="flex gap-4 mt-5">
                <button class="reorder bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600 transition" data-id="${order.orderId}">
                  <i class="fa fa-redo"></i> Reorder
                </button>
                <button class="delete bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition" data-id="${order.orderId}">
                  <i class="fa fa-trash"></i> Delete
                </button>
              </div>
            </div>
          `;
        });
        $("#ordersContainer").html(html);
      },
      error: function () {
        
      }
    });


CartApiServlet

package com.bite.controller;

import com.bite.model.Order;
import com.bite.service.OrderService;
import com.google.gson.Gson;

import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;

public class OrderHistoryServlet extends HttpServlet {
    private final OrderService orderService = new OrderService();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        resp.setContentType("application/json");

        if(session == null || session.getAttribute("user") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"error\":\"Not authenticated\"}");
            return;
        }


        int userId = ((com.bite.model.User) session.getAttribute("user")).getUserId();
        System.out.println("user id from OrderHistoryServlet: "+ userId);
        List<Order> orders = orderService.getUserOrders(userId);

        resp.getWriter().write(gson.toJson(orders));
    }
}


handle the error like if user not logged in go to login page utmost done in js error:functiom(){} pending

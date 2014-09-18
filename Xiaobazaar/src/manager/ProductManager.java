package manager;

import hibernate.HibernateUtil;

import java.util.ArrayList;
import java.util.List;

import model.Product;

import org.hibernate.criterion.DetachedCriteria;

public class ProductManager {
	// a. Product class method: C R U D
	public static ArrayList<Product> getAllProducts() {
		ArrayList<Product> products = new ArrayList<Product>();
		DetachedCriteria dc = DetachedCriteria.forClass(Product.class);
		List<Object> list = HibernateUtil.detachedCriteriaReturnList(dc);
		for (Object o : list) {
			products.add((Product) o);
		}
		return products;
	}

	public static Product getProductById(long id) {
		return (Product) HibernateUtil.get(Product.class, id);
	}

	public static void addProduct(Product product) {
		HibernateUtil.save(product);
	}

	public static void modifyProduct(Product modifiedProduct) {
		HibernateUtil.update(modifiedProduct);
	}

	public static void deleteProduct(Product product) {
		HibernateUtil.delete(product);
	}
}

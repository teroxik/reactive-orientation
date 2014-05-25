package utils

import java.net.{UnknownHostException, InetAddress, SocketException, NetworkInterface}
import collection.JavaConverters._

object IpAddress {

  def getIpAddreses(): List[String] = {

   try {
      NetworkInterface.getNetworkInterfaces().asScala.flatMap(_.getInetAddresses.asScala).map(processAddress(_)).toList
    } catch {
      case _: SocketException => List.empty
    }

  }

  def processAddress(address: InetAddress):String = {
    val bytes: Array[Byte] = address.getAddress
    s"${bytes(0) & 0xFF}.${bytes(1) & 0xFF}.${bytes(2) & 0xFF}.${bytes(3) & 0xFF}"

  }

}
